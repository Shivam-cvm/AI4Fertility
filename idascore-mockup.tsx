import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Upload, AlertCircle, CheckCircle, Clock, Users, Brain, Award } from 'lucide-react';

const IDAScore = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState('2025-06-22 14:30:15');
  const [selectedEmbryo, setSelectedEmbryo] = useState(null);

  // Mock patient data
  const patients = [
    {
      id: 'P001',
      name: 'Patient A',
      age: 32,
      protocol: 'ICSI',
      day: 5,
      embryos: [
        { id: 'E001', score: 9.2, rank: 1, quality: 'Excellent', implantationProb: 87, status: 'recommended', stage: 'blastocyst', expansion: 'expanded', icm: 'A', te: 'A' },
        { id: 'E002', score: 8.7, rank: 2, quality: 'Good', implantationProb: 78, status: 'good', stage: 'blastocyst', expansion: 'expanding', icm: 'B', te: 'A' },
        { id: 'E003', score: 7.1, rank: 3, quality: 'Fair', implantationProb: 58, status: 'fair', stage: 'blastocyst', expansion: 'early', icm: 'B', te: 'B' },
        { id: 'E004', score: 5.8, rank: 4, quality: 'Poor', implantationProb: 32, status: 'poor', stage: 'blastocyst', expansion: 'early', icm: 'C', te: 'C' }
      ]
    },
    {
      id: 'P002',
      name: 'Patient B',
      age: 29,
      protocol: 'IVF',
      day: 3,
      embryos: [
        { id: 'E005', score: 8.9, rank: 1, quality: 'Excellent', implantationProb: 81, status: 'recommended', stage: 'cleavage', cells: 8, fragmentation: 'none' },
        { id: 'E006', score: 8.1, rank: 2, quality: 'Good', implantationProb: 71, status: 'good', stage: 'cleavage', cells: 7, fragmentation: 'minimal' },
        { id: 'E007', score: 6.9, rank: 3, quality: 'Fair', implantationProb: 54, status: 'fair', stage: 'cleavage', cells: 6, fragmentation: 'moderate' }
      ]
    }
  ];

  // Component for embryo visualization
  const EmbryoImage = ({ embryo, size = 'md' }) => {
    const dimensions = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-32 h-32' : 'w-20 h-20';
    
    if (embryo.stage === 'blastocyst') {
      return (
        <div className={`${dimensions} relative bg-gray-100 rounded-full border-2 border-gray-300 overflow-hidden`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Zona pellucida */}
            <circle cx="50" cy="50" r="48" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            
            {/* Blastocoel cavity */}
            <circle cx="50" cy="50" r={embryo.expansion === 'expanded' ? 42 : embryo.expansion === 'expanding' ? 38 : 35} 
                   fill={embryo.expansion === 'expanded' ? '#e5e7eb' : '#f3f4f6'} />
            
            {/* Inner cell mass (ICM) */}
            <circle cx={embryo.expansion === 'expanded' ? 30 : 35} cy={embryo.expansion === 'expanded' ? 35 : 40} 
                   r={embryo.icm === 'A' ? 12 : embryo.icm === 'B' ? 10 : 8}
                   fill={embryo.icm === 'A' ? '#3b82f6' : embryo.icm === 'B' ? '#6366f1' : '#8b5cf6'} />
            
            {/* Trophectoderm cells */}
            {[...Array(embryo.te === 'A' ? 12 : embryo.te === 'B' ? 8 : 6)].map((_, i) => {
              const angle = (i * 360) / (embryo.te === 'A' ? 12 : embryo.te === 'B' ? 8 : 6);
              const radius = embryo.expansion === 'expanded' ? 40 : 33;
              const x = 50 + radius * Math.cos(angle * Math.PI / 180);
              const y = 50 + radius * Math.sin(angle * Math.PI / 180);
              return (
                <circle key={i} cx={x} cy={y} r="3" 
                       fill={embryo.te === 'A' ? '#10b981' : embryo.te === 'B' ? '#f59e0b' : '#ef4444'} />
              );
            })}
          </svg>
          
          {/* Quality indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center text-xs font-bold"
               style={{
                 borderColor: embryo.quality === 'Excellent' ? '#10b981' : 
                            embryo.quality === 'Good' ? '#f59e0b' : 
                            embryo.quality === 'Fair' ? '#f97316' : '#ef4444',
                 color: embryo.quality === 'Excellent' ? '#10b981' : 
                       embryo.quality === 'Good' ? '#f59e0b' : 
                       embryo.quality === 'Fair' ? '#f97316' : '#ef4444'
               }}>
            {embryo.rank}
          </div>
        </div>
      );
    } else {
      // Cleavage stage embryo
      return (
        <div className={`${dimensions} relative bg-gray-100 rounded-full border-2 border-gray-300 overflow-hidden`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Zona pellucida */}
            <circle cx="50" cy="50" r="48" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            
            {/* Blastomeres (cells) */}
            {[...Array(embryo.cells)].map((_, i) => {
              const angle = (i * 360) / embryo.cells;
              const radius = embryo.cells <= 4 ? 15 : embryo.cells <= 8 ? 18 : 20;
              const distance = embryo.cells <= 4 ? 15 : embryo.cells <= 8 ? 12 : 10;
              const x = 50 + distance * Math.cos(angle * Math.PI / 180);
              const y = 50 + distance * Math.sin(angle * Math.PI / 180);
              return (
                <circle key={i} cx={x} cy={y} r={radius / embryo.cells * 4} 
                       fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
              );
            })}
            
            {/* Fragmentation */}
            {embryo.fragmentation !== 'none' && [...Array(embryo.fragmentation === 'moderate' ? 6 : 3)].map((_, i) => {
              const angle = Math.random() * 360;
              const distance = 25 + Math.random() * 15;
              const x = 50 + distance * Math.cos(angle * Math.PI / 180);
              const y = 50 + distance * Math.sin(angle * Math.PI / 180);
              return (
                <circle key={i} cx={x} cy={y} r="2" fill="#ef4444" />
              );
            })}
          </svg>
          
          {/* Quality indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center text-xs font-bold"
               style={{
                 borderColor: embryo.quality === 'Excellent' ? '#10b981' : 
                            embryo.quality === 'Good' ? '#f59e0b' : 
                            embryo.quality === 'Fair' ? '#f97316' : '#ef4444',
                 color: embryo.quality === 'Excellent' ? '#10b981' : 
                       embryo.quality === 'Good' ? '#f59e0b' : 
                       embryo.quality === 'Fair' ? '#f97316' : '#ef4444'
               }}>
            {embryo.rank}
          </div>
        </div>
      );
    }
  };

  const runAnalysis = () => {
    setAnalysisRunning(true);
    setAnalysisComplete(false);
    
    // Simulate analysis time
    setTimeout(() => {
      setAnalysisRunning(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.0) return 'text-yellow-600';
    if (score >= 6.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 8.5) return 'bg-green-50 border-green-200';
    if (score >= 7.0) return 'bg-yellow-50 border-yellow-200';
    if (score >= 6.0) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('en-CA', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }).replace(/,/, ''));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">iDAScore™</h1>
                <p className="text-sm text-gray-500">Intelligent Data Analysis for Embryo Evaluation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Dr. Smith - Embryology Lab</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Patient Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Selection</h2>
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPatient?.id === patient.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">ID: {patient.id}</p>
                        <p className="text-sm text-gray-500">Age: {patient.age} | {patient.protocol}</p>
                        <p className="text-sm text-gray-500">Day {patient.day} embryos</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {patient.embryos.length} embryos
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Controls */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={runAnalysis}
                  disabled={!selectedPatient || analysisRunning}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {analysisRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Run AI Analysis
                    </>
                  )}
                </button>
                
                {analysisComplete && (
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Analysis completed in 21.3 seconds
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Panel */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Dataset:</span>
                  <span className="font-medium">180,000+ embryos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clinics Worldwide:</span>
                  <span className="font-medium">22 clinics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Version:</span>
                  <span className="font-medium">iDAScore v2.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AUC Performance:</span>
                  <span className="font-medium">0.707 (Day 5)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedPatient.name} - Embryo Analysis Results
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Day {selectedPatient.day} • {selectedPatient.protocol} • {selectedPatient.embryos.length} embryos analyzed
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Embryo Results */}
                  <div className="space-y-4">
                    {selectedPatient.embryos.map((embryo, index) => (
                      <div
                        key={embryo.id}
                        className={`p-4 rounded-lg border-2 ${getScoreBackground(embryo.score)} cursor-pointer hover:shadow-md transition-all`}
                        onClick={() => setSelectedEmbryo(embryo)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-300">
                              <span className="font-bold text-sm">{embryo.rank}</span>
                            </div>
                            
                            {/* Embryo Image */}
                            <EmbryoImage embryo={embryo} size="md" />
                            
                            <div>
                              <h3 className="font-semibold text-gray-900">Embryo {embryo.id}</h3>
                              <p className="text-sm text-gray-600">{embryo.quality} Quality</p>
                              {embryo.stage === 'blastocyst' ? (
                                <p className="text-xs text-gray-500">
                                  {embryo.expansion} blastocyst • ICM: {embryo.icm} • TE: {embryo.te}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  {embryo.cells} cells • {embryo.fragmentation} fragmentation
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(embryo.score)}`}>
                                {embryo.score}
                              </div>
                              <div className="text-xs text-gray-500">iDAScore</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {embryo.implantationProb}%
                              </div>
                              <div className="text-xs text-gray-500">Implantation Probability</div>
                            </div>
                            
                            <div className="text-center">
                              {embryo.rank === 1 && (
                                <div className="flex items-center text-green-600">
                                  <Award className="w-5 h-5 mr-1" />
                                  <span className="text-sm font-medium">Recommended</span>
                                </div>
                              )}
                              {embryo.rank === 2 && (
                                <div className="flex items-center text-yellow-600">
                                  <CheckCircle className="w-5 h-5 mr-1" />
                                  <span className="text-sm font-medium">Alternative</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar for Implantation Probability */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Implantation Likelihood</span>
                            <span>{embryo.implantationProb}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                embryo.implantationProb >= 80 ? 'bg-green-500' :
                                embryo.implantationProb >= 60 ? 'bg-yellow-500' :
                                embryo.implantationProb >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${embryo.implantationProb}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time-lapse Viewer for Selected Embryo */}
                  {selectedEmbryo && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Time-lapse Sequence - Embryo {selectedEmbryo.id}
                        </h3>
                        <button 
                          onClick={() => setSelectedEmbryo(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-3">
                        {[0, 24, 48, 72, 96, 120].map((hour, index) => (
                          <div key={hour} className="text-center">
                            <div className="mb-2">
                              <EmbryoImage 
                                embryo={{
                                  ...selectedEmbryo,
                                  expansion: hour >= 96 ? 'expanded' : hour >= 72 ? 'expanding' : 'early',
                                  cells: Math.min(selectedEmbryo.cells || 8, Math.max(1, Math.floor(Math.pow(2, hour/24)))),
                                  stage: hour >= 96 ? 'blastocyst' : 'cleavage'
                                }} 
                                size="sm" 
                              />
                            </div>
                            <div className="text-xs text-gray-600">
                              {hour}h
                            </div>
                            <div className="text-xs text-gray-500">
                              {hour >= 96 ? 'Blastocyst' : `${Math.min(selectedEmbryo.cells || 8, Math.max(1, Math.floor(Math.pow(2, hour/24))))} cells`}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-center space-x-4">
                        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          <Play className="w-4 h-4 mr-1" />
                          Play Sequence
                        </button>
                        <button className="flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restart
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6 mt-6 border-t">
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Select for Transfer
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Freeze Remaining
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Generate Report
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View Time-lapse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-500">Choose a patient from the left panel to view embryo analysis results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <span>iDAScore™ by Vitrolife | Deep Learning for Embryo Evaluation</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>CE MDR EU 2017/745</span>
              <span>Version 2.0.3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDAScore;