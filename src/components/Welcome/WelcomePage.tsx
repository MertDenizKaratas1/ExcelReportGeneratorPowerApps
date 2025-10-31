import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  Text,
  tokens,
  makeStyles,
  Divider,
  Badge
} from '@fluentui/react-components';
import {
  PlayCircle24Regular,
  Add24Regular,
  FolderOpen24Regular,
  BookInformation24Regular,
  ShieldLock24Regular,
  CloudArrowDown24Regular,
  ArrowRight24Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalXXXL}`,
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorBrandBackground} 35%, ${tokens.colorNeutralBackground1} 100%)`,
    color: tokens.colorNeutralForegroundOnBrand
  },
  content: {
    maxWidth: '1080px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
    color: tokens.colorNeutralForeground1
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
    gap: tokens.spacingHorizontalXXXL,
    alignItems: 'center',
    padding: tokens.spacingHorizontalXL,
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow28,
    color: tokens.colorNeutralForeground1
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: 1.2,
    color: tokens.colorBrandForeground1
  },
  heroSubtitle: {
    fontSize: '18px',
    color: tokens.colorNeutralForeground2
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalL
  },
  actionCard: {
    height: '100%',
    boxShadow: tokens.shadow16,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column'
  },
  actionContent: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground1
  },
  actionFooter: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resources: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL
  },
  resourceCard: {
    height: '100%',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8
  },
  badgeRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap'
  }
});

export interface WelcomePageProps {
  onGetStarted: () => void;
  onBrowseReports?: () => void;
  onImportSample?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGetStarted,
  onBrowseReports,
  onImportSample
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <Text block className={styles.heroTitle}>
              Welcome to the Excel Report Builder for Power Apps
            </Text>
            <Text block className={styles.heroSubtitle}>
              Craft pixel-perfect Excel exports using the same Fluent UI experience you use across the app. Automate document generation, reuse data sources, and share templates with your organization.
            </Text>
            <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, flexWrap: 'wrap' }}>
              <Button
                appearance="primary"
                size="large"
                icon={<PlayCircle24Regular />}
                onClick={onGetStarted}
              >
                Launch report workspace
              </Button>
              <Button
                appearance="secondary"
                size="large"
                icon={<FolderOpen24Regular />}
                onClick={onBrowseReports || onGetStarted}
              >
                Browse saved reports
              </Button>
            </div>
            <div className={styles.badgeRow}>
              <Badge appearance="outline" icon={<ShieldLock24Regular />}>Environment safe</Badge>
              <Badge appearance="outline" icon={<CloudArrowDown24Regular />}>One-click export</Badge>
            </div>
          </div>
          <div>
            <Card appearance="filled">
              <CardHeader
                header={<Text weight="semibold">Why teams choose this builder</Text>}
              />
              <div className={styles.actionContent}>
                <Text size={200}>✓ Drag-and-drop layout designer</Text>
                <Text size={200}>✓ Dynamic dataset mapping and transforms</Text>
                <Text size={200}>✓ Seamless publishing to Power Apps &amp; Power Automate</Text>
                <Divider />
                <Text size={200}>
                  Tip: Jump right in with our sample templates or start from a blank canvas tailored to your Dataverse entities.
                </Text>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <Text weight="semibold" size={500} block>
            Quick actions
          </Text>
          <div className={styles.quickActions}>
            <Card className={styles.actionCard}>
              <CardHeader
                header={<Text weight="semibold">Create a fresh report</Text>}
                description="Start from a clean layout and configure entities as you go"
              />
              <div className={styles.actionContent}>
                <Text size={200}>
                  Use the flow builder to assemble datasets, apply filters, and design Excel tabs using drag-and-drop sections.
                </Text>
              </div>
              <CardFooter className={styles.actionFooter}>
                <Button
                  appearance="primary"
                  icon={<Add24Regular />}
                  onClick={onGetStarted}
                >
                  Start new report
                </Button>
                <ArrowRight24Regular />
              </CardFooter>
            </Card>

            <Card className={styles.actionCard}>
              <CardHeader
                header={<Text weight="semibold">Resume previous work</Text>}
                description="Open an existing template saved to this environment"
              />
              <div className={styles.actionContent}>
                <Text size={200}>
                  Search, filter, and manage every report definition stored locally or synced from Dataverse.
                </Text>
              </div>
              <CardFooter className={styles.actionFooter}>
                <Button
                  appearance="primary"
                  icon={<FolderOpen24Regular />}
                  onClick={onBrowseReports || onGetStarted}
                >
                  Browse reports
                </Button>
                <ArrowRight24Regular />
              </CardFooter>
            </Card>

            <Card className={styles.actionCard}>
              <CardHeader
                header={<Text weight="semibold">Explore a guided template</Text>}
                description="Learn the fundamentals with a pre-built sample"
              />
              <div className={styles.actionContent}>
                <Text size={200}>
                  Import our walkthrough sample to understand recommended patterns for tabs, pivot tables, aggregations, and formatting rules.
                </Text>
              </div>
              <CardFooter className={styles.actionFooter}>
                <Button
                  appearance="primary"
                  icon={<BookInformation24Regular />}
                  onClick={onImportSample || onGetStarted}
                >
                  Load sample
                </Button>
                <ArrowRight24Regular />
              </CardFooter>
            </Card>
          </div>
        </section>

        <section>
          <Text weight="semibold" size={500} block>
            Helpful resources
          </Text>
          <div className={styles.resources}>
            <Card className={styles.resourceCard}>
              <CardHeader
                header={<Text weight="semibold">Documentation</Text>}
                description="Key concepts, advanced scenarios, and limitations"
              />
              <div className={styles.actionContent}>
                <Text size={200}>
                  Discover how report data flows, formula support, calculated columns, and styling tokens work together in the builder.
                </Text>
                <Button appearance="secondary" icon={<BookInformation24Regular />} disabled>
                  View docs
                </Button>
              </div>
            </Card>

            <Card className={styles.resourceCard}>
              <CardHeader
                header={<Text weight="semibold">Security &amp; compliance</Text>}
                description="Understand how data is stored and exported"
              />
              <div className={styles.actionContent}>
                <Text size={200}>
                  Review export policies, audit logging, and how the solution respects Dataverse column-level security in every pipeline.
                </Text>
                <Button appearance="secondary" icon={<ShieldLock24Regular />} disabled>
                  Review guidance
                </Button>
              </div>
            </Card>

            <Card className={styles.resourceCard}>
              <CardHeader
                header={<Text weight="semibold">Release notes</Text>}
                description="Stay on top of improvements and fixes"
              />
              <div className={styles.actionContent}>
                <Text size={200}>
                  Track component updates, new connectors, and upcoming roadmap features to plan your template updates confidently.
                </Text>
                <Button appearance="secondary" icon={<CloudArrowDown24Regular />} disabled>
                  View changelog
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};
