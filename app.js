const PDFProcessor = () => {
    const [data, setData] = React.useState([]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        const rows = text.split('\n');
        
        const schedule = rows
            .filter(row => row.trim().length > 0)
            .map(row => {
                const [id, name, origDur, remDur, start, finish] = row.split(/\t|,/);
                return {
                    'Activity ID': id?.trim(),
                    'Name': name?.trim(),
                    'Duration': origDur?.trim(),
                    'Start': start?.trim(),
                    'Finish': finish?.trim()
                };
            });
            
        setData(schedule);
    };

    const exportCSV = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schedule.csv';
        a.click();
    };

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Schedule Converter'),
        React.createElement('input', {
            type: 'file',
            onChange: handleFileUpload,
            className: 'mb-4 p-2 border rounded'
        }),
        data.length > 0 && React.createElement('button', {
            onClick: exportCSV,
            className: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        }, 'Export CSV'),
        data.length > 0 && React.createElement('div', { className: 'mt-4 overflow-x-auto' },
            React.createElement('table', { className: 'min-w-full border' },
                React.createElement('thead',
                    null,
                    React.createElement('tr', null,
                        Object.keys(data[0]).map(key =>
                            React.createElement('th', {
                                key,
                                className: 'border p-2 bg-gray-50'
                            }, key)
                        )
                    )
                ),
                React.createElement('tbody', null,
                    data.slice(0, 10).map((row, i) =>
                        React.createElement('tr', { key: i },
                            Object.values(row).map((val, j) =>
                                React.createElement('td', {
                                    key: j,
                                    className: 'border p-2'
                                }, val)
                            )
                        )
                    )
                )
            )
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(PDFProcessor));
