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
  Dropdown,
  Option,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
} from '@fluentui/react-components';
import {
  DocumentArrowDown20Regular,
} from '@fluentui/react-icons';
import { executePage, downloadFile } from '../../services/dynamicsApi';
import type { ExecutePageInput, LoadingState } from '../../types';

const useStyles = makeStyles({
  root: {
    maxWidth: '900px',
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
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
  },
  actionButtons: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginTop: '16px',
  },
});

export const ExecutePagePage: React.FC = () => {
  const styles = useStyles();
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [entityName, setEntityName] = useState('');
  const [recordId, setRecordId] = useState('');
  const [outputFormat, setOutputFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx');

  const handleSubmit = async () => {
    if (!entityName.trim()) {
      setMessage({ type: 'error', text: 'Please enter an entity name' });
      return;
    }

    setLoadingState('loading');
    setMessage(null);

    const input: ExecutePageInput = {
      entityName,
      recordId: recordId || undefined,
      outputFormat,
      includeHeaders: true,
    };

    try {
      const response = await executePage(input);

      if (response.success && response.data) {
        setLoadingState('success');
        setMessage({
          type: 'success',
          text: `Page generated successfully: ${response.data.fileName}`,
        });

        downloadFile(
          response.data.fileContent,
          response.data.fileName,
          response.data.mimeType
        );
      } else {
        setLoadingState('error');
        setMessage({ type: 'error', text: response.message || 'Failed to generate page' });
      }
    } catch (error: any) {
      setLoadingState('error');
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Title2 className={styles.title}>Execute Page</Title2>
        <Body1 className={styles.subtitle}>
          Generate a single-page report for a specific entity or record
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
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="entityName" required>Entity Name</Label>
            <Input
              id="entityName"
              value={entityName}
              onChange={(_, data) => setEntityName(data.value)}
              placeholder="e.g., account, contact"
            />
          </div>
          <div className={styles.formGroup}>
            <Label htmlFor="recordId">Record ID (Optional)</Label>
            <Input
              id="recordId"
              value={recordId}
              onChange={(_, data) => setRecordId(data.value)}
              placeholder="Enter GUID"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="outputFormat">Output Format</Label>
          <Dropdown
            id="outputFormat"
            value={outputFormat}
            selectedOptions={[outputFormat]}
            onOptionSelect={(_, data) => setOutputFormat(data.optionValue as any)}
          >
            <Option value="xlsx">Excel (.xlsx)</Option>
            <Option value="csv">CSV (.csv)</Option>
            <Option value="pdf">PDF (.pdf)</Option>
          </Dropdown>
        </div>

        <div className={styles.actionButtons}>
          <Button
            appearance="primary"
            size="large"
            icon={loadingState === 'loading' ? <Spinner size="tiny" /> : <DocumentArrowDown20Regular />}
            onClick={handleSubmit}
            disabled={loadingState === 'loading'}
          >
            {loadingState === 'loading' ? 'Generating...' : 'Generate Page'}
          </Button>
        </div>
      </div>
    </div>
  );
};
