import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Title1,
  Title3,
  Body1,
  Card,
  CardHeader,
  Button,
} from '@fluentui/react-components';
import {
  DocumentTable24Regular,
  DocumentOnePage24Regular,
  DataUsage24Regular,
  DatabaseSearch24Regular,
  ArrowRight20Regular,
  CheckmarkCircle20Filled,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { isDynamics365 } from '../../services/dynamicsApi';

const useStyles = makeStyles({
  root: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    marginBottom: '8px',
  },
  subtitle: {
    color: "#ffffff",
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('8px', '16px'),
    ...shorthands.borderRadius('8px'),
    marginTop: '16px',
  },
  statusOnline: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground1,
  },
  statusOffline: {
    backgroundColor: tokens.colorPaletteBeigeBackground2,
    color: tokens.colorPaletteBeigeForeground2,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '32px',
  },
  card: {
    height: '100%',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  cardContent: {
    ...shorthands.padding('20px'),
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '16px',
    color: tokens.colorBrandForeground1,
  },
  cardTitle: {
    marginBottom: '8px',
  },
  cardDescription: {
    color: "#ffffff",
    marginBottom: '16px',
    minHeight: '48px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  section: {
    marginTop: '48px',
  },
  featureList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('16px'),
    marginTop: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  featureIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '20px',
    marginTop: '2px',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: 600,
    marginBottom: '4px',
  },
  featureDescription: {
    fontSize: '14px',
    color: "#ffffff",
  },
});

export const DashboardPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const isOnline = isDynamics365();

  const features = [
    {
      icon: <DocumentTable24Regular />,
      title: 'Compile Report',
      description: 'Create comprehensive Excel reports with multiple worksheets and data sources',
      path: '/compile-report',
      color: tokens.colorPaletteBlueForeground2,
    },
    {
      icon: <DocumentOnePage24Regular />,
      title: 'Execute Page',
      description: 'Generate single-page reports for specific entities and records',
      path: '/execute-page',
      color: tokens.colorPalettePurpleForeground2,
    },
    {
      icon: <DataUsage24Regular />,
      title: 'Entity Graph',
      description: 'Visualize entity relationships and explore data model connections',
      path: '/entity-graph',
      color: tokens.colorPaletteTealForeground2,
    },
    {
      icon: <DatabaseSearch24Regular />,
      title: 'Metadata Snapshot',
      description: 'Capture and analyze comprehensive CRM metadata and configurations',
      path: '/metadata-snapshot',
      color: tokens.colorPaletteDarkOrangeForeground1,
    },
  ];

  const capabilities = [
    {
      title: 'Multi-Sheet Reports',
      description: 'Combine multiple data sources into a single workbook',
    },
    {
      title: 'Custom Formatting',
      description: 'Apply templates, styling, and professional formatting',
    },
    {
      title: 'Dynamic Data',
      description: 'Pull live data from Dynamics 365 entities',
    },
    {
      title: 'Export Options',
      description: 'Support for XLSX, CSV, and PDF formats',
    },
    {
      title: 'Relationship Mapping',
      description: 'Visualize entity connections and dependencies',
    },
    {
      title: 'Metadata Analysis',
      description: 'Document schema, option sets, and solutions',
    },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Title1 className={styles.title}>Excel Generator</Title1>
        <Body1 className={styles.subtitle}>
          Powerful report generation and metadata tools for Power Apps & Dynamics 365
        </Body1>
        <div
          className={`${styles.statusBadge} ${
            isOnline ? styles.statusOnline : styles.statusOffline
          }`}
        >
          <CheckmarkCircle20Filled />
          <span>
            {isOnline
              ? 'Connected to Dynamics 365'
              : 'Running in Local Mode (Mock Data)'}
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {features.map((feature) => (
          <Card
            key={feature.path}
            className={styles.card}
            onClick={() => navigate(feature.path)}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>{feature.icon}</div>
              <Title3 className={styles.cardTitle}>{feature.title}</Title3>
              <Body1 className={styles.cardDescription}>
                {feature.description}
              </Body1>
              <div className={styles.cardFooter}>
                <Button
                  appearance="subtle"
                  icon={<ArrowRight20Regular />}
                  iconPosition="after"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.section}>
        <Title3 className={styles.cardTitle}>Key Capabilities</Title3>
        <div className={styles.featureList}>
          {capabilities.map((capability, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <CheckmarkCircle20Filled />
              </div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>{capability.title}</div>
                <div className={styles.featureDescription}>
                  {capability.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
