import React, { useState } from 'react';

export default function PDFProcessor() {
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const text = await file.text();
    const rows = text.split('\n');
    const schedule = rows
      .filter(row => /^[A-Z0-9]+\.?[A-Z0-9]*/.test(row))
      .map(row => {
        const [id, name, origDur, remDur, start, finish] = row.split(',');
        return {
          'Activity ID': id,
          'Activity Name': name,
          'Duration': origDur,
          'Start': start,
          'Finish': finish,
          'Color': name?.includes('Summary') ? '#0066CC' : ''
        };
      });
    setData(schedule);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], {type: 'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'schedule.csv';
    a.click();
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {data.length > 0 && (
        <>
          <button onClick={exportCSV}>Export CSV</button>
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.slice(0,10).map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
