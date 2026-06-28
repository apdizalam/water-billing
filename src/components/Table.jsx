import React from 'react';

export default function Table({ columns, data, renderRow, emptyMessage = "No data found.", minWidth = "1500px" }) {
  return (
    <div className="w-full overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm my-4">
      <table style={{ minWidth: minWidth }} className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            {columns.map((col, index) => {
              const isName = col.toLowerCase().includes('name') || col.toLowerCase().includes('owner') || col.toLowerCase().includes('customer');
              return (
                <th 
                  key={index} 
                  style={{ minWidth: isName ? 280 : undefined }}
                  className="whitespace-nowrap px-8 py-4 font-bold text-xs text-slate-500 tracking-wider uppercase"
                >
                  {col}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-8 text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
