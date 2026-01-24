import { useState } from 'react';

function Expenses() {
    // --- DUMMY DATA ---
    // In the future, 'spent' and 'remaining' will be calculated automatically from the list below
    const budgetStats = { 
        total: 50000, 
        spent: 15200, 
        remaining: 34800 
    };
    
    const [expenses] = useState([
        { id: 1, item: "Venue Advance", category: "Venue", amount: 5000, date: "2023-10-01", status: "Paid" },
        { id: 2, item: "Wedding Dress", category: "Attire", amount: 2500, date: "2023-10-05", status: "Paid" },
        { id: 3, item: "Catering Deposit", category: "Food", amount: 1200, date: "2023-10-10", status: "Pending" },
        { id: 4, item: "Florist Booking", category: "Decor", amount: 800, date: "2023-10-12", status: "Pending" },
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Budget Tracker</h2>
                <div>
                    <button className="btn-secondary" style={{ marginRight: '10px', padding: '10px 20px', background: 'white', border: '1px solid #ddd', borderRadius: '5px' }}>Set Budget</button>
                    <button className="btn-primary" style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '5px' }}>+ Add Expense</button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="vendor-grid" style={{ marginBottom: '30px' }}>
                <div className="summary-card">
                    <span style={{ color: '#666' }}>Total Budget</span>
                    <h3 style={{ fontSize: '1.8rem', margin: '5px 0' }}>${budgetStats.total.toLocaleString()}</h3>
                </div>
                <div className="summary-card">
                    <span style={{ color: '#666' }}>Spent</span>
                    <h3 style={{ fontSize: '1.8rem', margin: '5px 0', color: '#c53030' }}>${budgetStats.spent.toLocaleString()}</h3>
                </div>
                <div className="summary-card">
                    <span style={{ color: '#666' }}>Remaining</span>
                    <h3 style={{ fontSize: '1.8rem', margin: '5px 0', color: 'green' }}>${budgetStats.remaining.toLocaleString()}</h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="expense-list-container" style={{ background: 'white', border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Transaction History</h3>
                
                <table className="standard-table">
                    <thead>
                        <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Item</th>
                            <th style={{ padding: '12px' }}>Category</th>
                            <th style={{ padding: '12px' }}>Date</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px' }}>
                                    <strong>{expense.item}</strong>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', color: '#666' }}>{expense.date}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ 
                                        color: expense.status === 'Paid' ? 'green' : 'orange',
                                        fontWeight: 500
                                    }}>
                                        {expense.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                    ${expense.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Expenses;