
import React from 'react';
import { VideoFile } from '../types';

interface VideoTableProps {
  files: VideoFile[];
}

const VideoTable: React.FC<VideoTableProps> = ({ files }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700 border-b">File Name</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700 border-b">Type</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700 border-b text-right">Notes (AR/EN)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {files.map((file, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-600 font-mono break-all">{file.name}</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium uppercase">
                  {file.type.split('/').pop()}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-700 text-right font-arabic" dir="auto">
                {file.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoTable;
