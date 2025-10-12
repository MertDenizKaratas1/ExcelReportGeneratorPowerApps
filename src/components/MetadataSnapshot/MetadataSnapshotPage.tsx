import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Title2,
  Body1,
  Button,
  Checkbox,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Card,
} from '@fluentui/react-components';
import {
  DatabaseSearch20Regular,
} from '@fluentui/react-icons';
import { getMetadataSnapshot } from '../../services/dynamicsApi';
import type { GetMetadataSnapshotInput, MetadataSnapshotOutput, LoadingState } from '../../types';

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
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('12px'),
    marginBottom: '16px',
  },
  results: {
    display: 'grid',
    ...shorthands.gap('16px'),
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    ...shorthands.gap('16px'),
    marginBottom: '24px',
  },
  statCard: {
    ...shorthands.padding('20px'),
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 600,
    color: tokens.colorBrandForeground1,
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: "#ffffff",
  },
  entityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    ...shorthands.gap('12px'),
  },
  entityCard: {
    ...shorthands.padding('16px'),
  },
  entityName: {
    fontWeight: 600,
    marginBottom: '4px',
  },
  entityDetails: {
    fontSize: '14px',
    color: "#ffffff",
  },
});

export const MetadataSnapshotPage: React.FC = () => {
  const styles = useStyles();
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [snapshotData, setSnapshotData] = useState<MetadataSnapshotOutput | null>(null);

  const [includeEntities, setIncludeEntities] = useState(true);
  const [includeAttributes, setIncludeAttributes] = useState(false);
  const [includeRelationships, setIncludeRelationships] = useState(false);
  const [includeOptionSets, setIncludeOptionSets] = useState(false);
  const [includeSolutions, setIncludeSolutions] = useState(false);
  const [filterSystemEntities, setFilterSystemEntities] = useState(true);

  const handleSubmit = async () => {
    setLoadingState('loading');
    setMessage(null);
    setSnapshotData(null);

    const input: GetMetadataSnapshotInput = {
      includeEntities,
      includeAttributes,
      includeRelationships,
      includeOptionSets,
      includeSolutions,
      filterSystemEntities,
      uiLcid: 1033,
    };

    try {
      const response = await getMetadataSnapshot(input);

      if (response.success && response.data) {
        setLoadingState('success');
        setSnapshotData(response.data);
        setMessage({
          type: 'success',
          text: `Snapshot captured: ${response.data.metadata.totalEntities} entities`,
        });
      } else {
        setLoadingState('error');
        setMessage({ type: 'error', text: response.message || 'Failed to capture snapshot' });
      }
    } catch (error: any) {
      setLoadingState('error');
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Title2 className={styles.title}>Metadata Snapshot</Title2>
        <Body1 className={styles.subtitle}>
          Capture comprehensive CRM metadata for documentation and analysis
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
        <div className={styles.checkboxGroup}>
          <Checkbox
            label="Include Entities"
            checked={includeEntities}
            onChange={(_, data) => setIncludeEntities(data.checked === true)}
          />
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
            label="Include Option Sets"
            checked={includeOptionSets}
            onChange={(_, data) => setIncludeOptionSets(data.checked === true)}
          />
          <Checkbox
            label="Include Solutions"
            checked={includeSolutions}
            onChange={(_, data) => setIncludeSolutions(data.checked === true)}
          />
          <Checkbox
            label="Filter System Entities"
            checked={filterSystemEntities}
            onChange={(_, data) => setFilterSystemEntities(data.checked === true)}
          />
        </div>

        <Button
          appearance="primary"
          icon={loadingState === 'loading' ? <Spinner size="tiny" /> : <DatabaseSearch20Regular />}
          onClick={handleSubmit}
          disabled={loadingState === 'loading'}
        >
          {loadingState === 'loading' ? 'Capturing...' : 'Capture Snapshot'}
        </Button>
      </div>

      {snapshotData && (
        <div className={styles.results}>
          <div className={styles.stats}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{snapshotData.metadata.totalEntities}</div>
              <div className={styles.statLabel}>Total Entities</div>
            </Card>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{snapshotData.metadata.customEntities}</div>
              <div className={styles.statLabel}>Custom Entities</div>
            </Card>
            {snapshotData.metadata.totalOptionSets !== undefined && (
              <Card className={styles.statCard}>
                <div className={styles.statValue}>{snapshotData.metadata.totalOptionSets}</div>
                <div className={styles.statLabel}>Option Sets</div>
              </Card>
            )}
            {snapshotData.metadata.totalSolutions !== undefined && (
              <Card className={styles.statCard}>
                <div className={styles.statValue}>{snapshotData.metadata.totalSolutions}</div>
                <div className={styles.statLabel}>Solutions</div>
              </Card>
            )}
          </div>

          {snapshotData.entities && (
            <div>
              <Title2>Entities ({snapshotData.entities.length})</Title2>
              <div className={styles.entityGrid}>
                {snapshotData.entities.slice(0, 50).map((entity, index) => (
                  <Card key={index} className={styles.entityCard}>
                    <div className={styles.entityName}>{entity.displayName}</div>
                    <div className={styles.entityDetails}>
                      {entity.logicalName}
                      <br />
                      {entity.isCustomEntity ? 'Custom' : 'System'} | 
                      Type: {entity.objectTypeCode}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
