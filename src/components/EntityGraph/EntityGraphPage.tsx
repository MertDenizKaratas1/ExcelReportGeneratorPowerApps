import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Title2,
  Body1,
  Button,
  Input,
  Label,
  Checkbox,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Card,
} from '@fluentui/react-components';
import {
  Search20Regular,
} from '@fluentui/react-icons';
import { getEntityGraph } from '../../services/dynamicsApi';
import type { GetEntityGraphInput, EntityGraphOutput, LoadingState } from '../../types';

const useStyles = makeStyles({
  root: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    marginBottom: '8px',
  },
  subtitle: {
    color: "#ffffff",
  },
  form: {
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    marginBottom: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
  },
  results: {
    display: 'grid',
    ...shorthands.gap('16px'),
  },
  entityCard: {
    ...shorthands.padding('16px'),
  },
  entityHeader: {
    fontWeight: 600,
    marginBottom: '8px',
  },
  relationshipList: {
    marginTop: '12px',
  },
  relationshipItem: {
    ...shorthands.padding('8px'),
    ...shorthands.borderRadius('4px'),
    backgroundColor: tokens.colorNeutralBackground3,
    marginBottom: '4px',
    fontSize: '14px',
  },
  stats: {
    display: 'flex',
    ...shorthands.gap('24px'),
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorBrandBackground2,
    marginBottom: '16px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: tokens.colorBrandForeground1,
  },
  statLabel: {
    fontSize: '14px',
    color: "#ffffff",
  },
});

export const EntityGraphPage: React.FC = () => {
  const styles = useStyles();
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [graphData, setGraphData] = useState<EntityGraphOutput | null>(null);

  const [entityName, setEntityName] = useState('');
  const [maxDepth, setMaxDepth] = useState('2');
  const [includeAttributes, setIncludeAttributes] = useState(true);
  const [includeRelationships, setIncludeRelationships] = useState(true);
  const [filterSystemEntities, setFilterSystemEntities] = useState(true);

  const handleSubmit = async () => {
    if (!entityName.trim()) {
      setMessage({ type: 'error', text: 'Please enter an entity name' });
      return;
    }

    setLoadingState('loading');
    setMessage(null);
    setGraphData(null);

    const input: GetEntityGraphInput = {
      entityName,
      maxDepth: parseInt(maxDepth) || 2,
      includeAttributes,
      includeRelationships,
      filterSystemEntities,
    };

    try {
      const response = await getEntityGraph(input);

      if (response.success && response.data) {
        setLoadingState('success');
        setGraphData(response.data);
        setMessage({
          type: 'success',
          text: `Found ${response.data.entities.length} entities and ${response.data.relationships.length} relationships`,
        });
      } else {
        setLoadingState('error');
        setMessage({ type: 'error', text: response.message || 'Failed to fetch entity graph' });
      }
    } catch (error: any) {
      setLoadingState('error');
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Title2 className={styles.title}>Entity Graph</Title2>
        <Body1 className={styles.subtitle}>
          Visualize entity relationships and explore your data model
        </Body1>
      </div>

      {message && (
        <MessageBar intent={message.type === 'success' ? 'success' : 'error'}>
          <MessageBarBody>
            <MessageBarTitle>{message.type === 'success' ? 'Success' : 'Error'}</MessageBarTitle>
            {message.text}
          </MessageBarBody>
        </MessageBar>
      )}

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <Label htmlFor="entityName" required>Entity Name</Label>
          <Input
            id="entityName"
            value={entityName}
            onChange={(_, data) => setEntityName(data.value)}
            placeholder="e.g., account, contact"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="maxDepth">Max Depth</Label>
            <Input
              id="maxDepth"
              type="number"
              value={maxDepth}
              onChange={(_, data) => setMaxDepth(data.value)}
            />
          </div>
          <div>
            <Checkbox
              label="Include Attributes"
              checked={includeAttributes}
              onChange={(_, data) => setIncludeAttributes(data.checked === true)}
            />
            <Checkbox
              label="Include Relationships"
              checked={includeRelationships}
              onChange={(_, data) => setIncludeRelationships(data.checked === true)}
            />
            <Checkbox
              label="Filter System Entities"
              checked={filterSystemEntities}
              onChange={(_, data) => setFilterSystemEntities(data.checked === true)}
            />
          </div>
        </div>

        <Button
          appearance="primary"
          icon={loadingState === 'loading' ? <Spinner size="tiny" /> : <Search20Regular />}
          onClick={handleSubmit}
          disabled={loadingState === 'loading'}
        >
          {loadingState === 'loading' ? 'Loading...' : 'Explore Graph'}
        </Button>
      </div>

      {graphData && (
        <div className={styles.results}>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{graphData.metadata.totalEntities}</div>
              <div className={styles.statLabel}>Entities</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{graphData.metadata.totalRelationships}</div>
              <div className={styles.statLabel}>Relationships</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{graphData.metadata.maxDepth}</div>
              <div className={styles.statLabel}>Max Depth</div>
            </div>
          </div>

          {graphData.entities.map((entity, index) => (
            <Card key={index} className={styles.entityCard}>
              <div className={styles.entityHeader}>
                {entity.displayName} ({entity.logicalName})
              </div>
              <Body1>
                Depth: {entity.depth} | Type Code: {entity.objectTypeCode} | 
                {entity.isCustomEntity ? ' Custom' : ' System'}
              </Body1>
              {entity.attributes && entity.attributes.length > 0 && (
                <Body1>Attributes: {entity.attributes.length}</Body1>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
