import React, { useState, useEffect } from 'react';
import {
  shorthands,
  tokens,
  Title2,
  Title3,
  Body1,
  Button,
  Input,
  Label,
  Textarea,
  Dropdown,
  Option,
  Checkbox,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
} from '@fluentui/react-components';
import {
  Add20Regular,
  Delete20Regular,
  DocumentArrowDown20Regular,
  Checkmark20Regular,
  Dismiss20Regular,
} from '@fluentui/react-icons';
import { compileReport, downloadFile } from '../../services/dynamicsApi';
import { fetchEntities, fetchRelationships, EntitySummary, RelationshipSummary } from '../../services/metadataService';
import type {
  CompileReportInput,
  ExtendedDataSource,
  SelectedRelationship,
  WorksheetRequest,
  ColumnRequest,
  LoadingState,
} from '../../types';

export const CompileReportPage: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [reportName, setReportName] = useState('');
  const [outputFormat, setOutputFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx');
  const [includeCharts, setIncludeCharts] = useState(false);
  const [step, setStep] = useState<number>(0); // 0=Entity,1=Relationships,2=Data Sources,3=Worksheets,4=Review

  // Entity and relationship selection
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [entityLoading, setEntityLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [relationships, setRelationships] = useState<RelationshipSummary[]>([]);
  const [relationshipLoading, setRelationshipLoading] = useState(false);
  const [selectedRelationships, setSelectedRelationships] = useState<SelectedRelationship[]>([]);

  // Data sources and worksheets
  const [dataSources, setDataSources] = useState<ExtendedDataSource[]>([]);
  const [worksheets, setWorksheets] = useState<WorksheetRequest[]>([]);

  // Worksheet / Column helpers (must be inside component scope before usage)
  const addWorksheet = () => {
    setWorksheets(prev => ([
      ...prev,
      {
        name: `Sheet${prev.length + 1}`,
        template: '',
        dataSource: dataSources[0]?.name || '',
        columns: [],
        includeHeaders: true,
      },
    ]));
  };

  const removeWorksheet = (index: number) => {
    setWorksheets(prev => prev.filter((_, i) => i !== index));
  };

  const updateWorksheet = (index: number, field: keyof WorksheetRequest, value: any) => {
    setWorksheets(prev => prev.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  };

  const addColumn = (worksheetIndex: number) => {
    setWorksheets(prev => prev.map((w, i) => {
      if (i !== worksheetIndex) return w;
      const nextIndex = w.columns.length + 1;
      return {
        ...w,
        columns: [
          ...w.columns,
          { name: `Column${nextIndex}`, fieldName: '', displayName: '', dataType: 'string', width: 120 },
        ],
      };
    }));
  };

  const removeColumn = (worksheetIndex: number, columnIndex: number) => {
    setWorksheets(prev => prev.map((w, i) => {
      if (i !== worksheetIndex) return w;
      return { ...w, columns: w.columns.filter((_, ci) => ci !== columnIndex) };
    }));
  };

  useEffect(() => {
    // Load entities at mount
    const load = async () => {
      setEntityLoading(true);
      const list = await fetchEntities();
      setEntities(list);
      setEntityLoading(false);
    }; load();
  }, []);

  useEffect(() => {
    if (!selectedEntity) return;
    const loadRels = async () => {
      setRelationshipLoading(true);
      const rels = await fetchRelationships(selectedEntity);
      setRelationships(rels);
      setRelationshipLoading(false);
    }; loadRels();
  }, [selectedEntity]);

  const toggleRelationship = (r: RelationshipSummary) => {
    setSelectedRelationships(prev => {
      const exists = prev.find(p => p.schemaName === r.schemaName);
      if (exists) return prev.filter(p => p.schemaName !== r.schemaName);
      return [...prev, r];
    });
  };

  // When entity selected for first time bootstrap a default data source
  useEffect(() => {
    if (selectedEntity && dataSources.length === 0) {
      setDataSources([{
        name: 'Primary',
        entityName: selectedEntity,
        query: '',
        filters: {},
        relationships: [],
      }]);
    }
  }, [selectedEntity]);

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const stepTitles = ['Select Entity', 'Select Relationships', 'Configure Data Sources', 'Configure Worksheets', 'Review & Generate'];

  // Integrate selected relationships into first datasource before submit
  const buildCompileInput = (): CompileReportInput => ({
    reportName,
    dataSources: dataSources.map(ds => ({
      name: ds.name,
      entityName: ds.entityName,
      query: ds.query,
      filters: ds.filters,
      // relationships are UI only; could serialize to query later if needed
    })),
    worksheets,
    outputFormat,
    includeCharts,
    reportSettings: { selectedRelationships: selectedRelationships.map(r => ({ schemaName: r.schemaName, type: r.relationshipType, from: r.fromEntity, to: r.toEntity })) },
  });

  // Override handleSubmit to use buildCompileInput()
  const handleSubmit = async () => {
    if (!reportName.trim()) { setMessage({ type: 'error', text: 'Please enter a report name' }); return; }
    if (!selectedEntity) { setMessage({ type: 'error', text: 'Select a primary entity' }); return; }
    if (worksheets.length === 0) { setMessage({ type: 'error', text: 'Add at least one worksheet' }); return; }
    setLoadingState('loading'); setMessage(null);
    try {
      const response = await compileReport(buildCompileInput());
      if (response.success && response.data) {
        setLoadingState('success');
        setMessage({ type: 'success', text: `Report "${response.data.fileName}" generated (${response.data.recordCount || 0} records)` });
        downloadFile(response.data.fileContent, response.data.fileName, response.data.mimeType);
      } else {
        setLoadingState('error'); setMessage({ type: 'error', text: response.message || 'Failed to generate report' });
      }
    } catch (e: any) {
      setLoadingState('error'); setMessage({ type: 'error', text: e.message || 'Unexpected error' });
    }
  };

  // Render helpers for steps
  const renderEntityStep = () => (
    <div>
      <h3 style={{ margin: '0 0 16px' }}>Choose Primary Entity</h3>
      {entityLoading && <div>Loading entities...</div>}
      {!entityLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {entities.map(e => {
            const active = selectedEntity === e.logicalName;
            return (
              <button key={e.logicalName} onClick={() => setSelectedEntity(e.logicalName)} style={{
                textAlign: 'left',
                border: active ? '2px solid #115ea3' : '1px solid #ccc',
                borderRadius: 8,
                padding: '12px 14px',
                background: active ? '#e6f2fb' : '#fff',
                cursor: 'pointer'
              }}>
                <div style={{ fontWeight: 600 }}>{e.displayName}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{e.logicalName}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderRelationshipStep = () => (
    <div>
      <h3 style={{ margin: '0 0 8px' }}>Select Relationships</h3>
      <p style={{ marginTop: 0, color: '#555', fontSize: 13 }}>Optional: choose related entities to enrich report context.</p>
      {relationshipLoading && <div>Loading relationships...</div>}
      {!relationshipLoading && relationships.length === 0 && <div style={{ color: '#777' }}>No relationships found or not loaded.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
        {relationships.map(r => {
          const active = !!selectedRelationships.find(sr => sr.schemaName === r.schemaName);
          return (
            <div key={r.schemaName} style={{
              border: active ? '2px solid #2564cf' : '1px solid #d1d1d1',
              background: active ? '#f0f6ff' : '#fafafa',
              borderRadius: 8,
              padding: 10,
              cursor: 'pointer'
            }} onClick={() => toggleRelationship(r)}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.schemaName}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{r.relationshipType}</div>
              <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>{r.fromEntity} → {r.toEntity}</div>
            </div>
          );
        })}
      </div>
      {selectedRelationships.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: '#333' }}>
          {selectedRelationships.length} relationship(s) selected.
        </div>
      )}
    </div>
  );

  const renderDataSourcesStep = () => (
    <div>
      <h3 style={{ margin: '0 0 12px' }}>Configure Data Sources</h3>
      <p style={{ marginTop: 0, fontSize: 13, color: '#555' }}>Primary entity defaults to selected entity. Add additional data sources if needed.</p>
      {dataSources.map((ds, index) => (
        <div key={index} style={{ border: '1px solid #d1d1d1', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{ds.name}</strong>
            {index > 0 && <button onClick={() => setDataSources(prev => prev.filter((_,i) => i!== index))} style={{ background: 'none', border: 'none', color: '#a4262c', cursor: 'pointer' }}>Remove</button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginTop: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Name</label>
              <input style={{ width: '100%' }} value={ds.name} onChange={e => {
                const v = e.target.value; setDataSources(prev => prev.map((p,i) => i===index?{...p,name:v}:p));
              }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Entity</label>
              <input style={{ width: '100%' }} value={ds.entityName} onChange={e => {
                const v = e.target.value; setDataSources(prev => prev.map((p,i) => i===index?{...p,entityName:v}:p));
              }} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Query (FetchXML/OData)</label>
            <textarea style={{ width: '100%', minHeight: 70 }} value={ds.query} onChange={e => {
              const v = e.target.value; setDataSources(prev => prev.map((p,i) => i===index?{...p,query:v}:p));
            }} />
          </div>
        </div>
      ))}
      <button onClick={() => setDataSources(prev => [...prev, { name: `DataSource${prev.length + 1}`, entityName: selectedEntity, query: '', filters: {}, relationships: [] }])} style={{
        background: '#2564cf', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 4, cursor: 'pointer' }}>Add Data Source</button>
    </div>
  );

  const renderWorksheetsStep = () => (
    <div>
      <h3 style={{ margin: '0 0 12px' }}>Worksheets</h3>
      <p style={{ marginTop: 0, fontSize: 13, color: '#555' }}>Define how data will appear in the generated workbook.</p>
      {worksheets.map((ws, wsIndex) => (
        <div key={wsIndex} style={{ border: '1px solid #d1d1d1', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{ws.name}</strong>
            <button onClick={() => removeWorksheet(wsIndex)} style={{ background: 'none', border: 'none', color: '#a4262c', cursor: 'pointer' }}>Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginTop: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Name</label>
              <input style={{ width: '100%' }} value={ws.name} onChange={e => updateWorksheet(wsIndex, 'name', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Data Source</label>
              <select style={{ width: '100%' }} value={ws.dataSource} onChange={e => updateWorksheet(wsIndex, 'dataSource', e.target.value)}>
                {dataSources.map(ds => <option key={ds.name} value={ds.name}>{ds.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Columns</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {ws.columns.map((c, colIndex) => (
                <div key={colIndex} style={{ background: '#f3f2f1', padding: '6px 10px', borderRadius: 16, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{c.displayName || c.name}</span>
                  <button onClick={() => removeColumn(wsIndex, colIndex)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a4262c' }}>✕</button>
                </div>
              ))}
              <button onClick={() => addColumn(wsIndex)} style={{ background: '#e6f2fb', border: '1px dashed #2564cf', padding: '6px 10px', borderRadius: 16, fontSize: 12, cursor: 'pointer', color: '#115ea3' }}>+ Add</button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addWorksheet} disabled={dataSources.length === 0} style={{ background: '#2564cf', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 4, cursor: 'pointer' }}>Add Worksheet</button>
    </div>
  );

  const renderReviewStep = () => (
    <div>
      <h3 style={{ margin: '0 0 12px' }}>Review</h3>
      <p style={{ marginTop: 0, fontSize: 13 }}>Confirm configuration before generating.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ border: '1px solid #d1d1d1', borderRadius: 8, padding: 12 }}>
          <strong>Report:</strong> {reportName || 'Untitled'}<br />
          <strong>Primary Entity:</strong> {selectedEntity || '—'}<br />
          <strong>Relationships:</strong> {selectedRelationships.length}<br />
          <strong>Data Sources:</strong> {dataSources.length}<br />
          <strong>Worksheets:</strong> {worksheets.length}
        </div>
        <button onClick={handleSubmit} disabled={loadingState === 'loading'} style={{ background: '#2564cf', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>
          {loadingState === 'loading' ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );

  // Worksheet / column helpers (must be before return in component scope)

  // Replace original big form with wizard container
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 12px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>Compile Report</h1>
          <div style={{ color: '#555', marginTop: 4 }}>Design a multi-worksheet Excel report using Dynamics 365 data.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && <button onClick={prevStep} style={{ background: '#f3f2f1', border: '1px solid #d1d1d1', padding: '8px 14px', borderRadius: 4, cursor: 'pointer' }}>Back</button>}
          {step < 4 && <button onClick={nextStep} style={{ background: '#2564cf', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 4, cursor: 'pointer' }}>Next</button>}
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {stepTitles.map((t, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: active ? '#2564cf' : done ? '#107c10' : '#e1e1e1',
                color: active || done ? '#fff' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600
              }}>{done ? '✓' : i + 1}</div>
              <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? '#2564cf' : '#444' }}>{t}</div>
            </div>
          );
        })}
      </div>

      {message && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 6, background: message.type === 'success' ? '#dff6dd' : '#fde7e9', color: message.type === 'success' ? '#107c10' : '#a4262c', fontSize: 14 }}>
          <strong style={{ display: 'block', marginBottom: 4 }}>{message.type === 'success' ? 'Success' : 'Error'}</strong>
          {message.text}
        </div>
      )}

      <div style={{ background: '#ffffff', border: '1px solid #e1e1e1', borderRadius: 10, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        {step === 0 && renderEntityStep()}
        {step === 1 && renderRelationshipStep()}
        {step === 2 && renderDataSourcesStep()}
        {step === 3 && renderWorksheetsStep()}
        {step === 4 && renderReviewStep()}
      </div>
    </div>
  );
};
