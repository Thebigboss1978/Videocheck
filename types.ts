
export interface VideoFile {
  name: string;
  type: string;
  notes: string;
}

export interface AnalysisResult {
  summary: string;
  contentThemes: string[];
  recommendedTools: {
    name: string;
    description: string;
    useCase: string;
  }[];
  socialMediaStrategy: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
