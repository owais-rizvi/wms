import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';

function Expenses() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        category: '',
        description: '',
        amount: 0
    });

    const getWeddingId = () => {
        const savedWedding = localStorage.getItem('activeWedding');
        if (!savedWedding) {
            navigate('/weddings');
            return null;
        }
        const wedding = JSON.parse(savedWedding);
        return wedding._id || wedding.id;
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const data = await apiCall(`/weddings/${weddingId}/expenses`);
            setExpenses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const expense = await apiCall(`/weddings/${weddingId}/expenses`, {
                method: 'POST',
                body: JSON.stringify(newExpense)
            });
            setExpenses([...expenses, expense]);
            setNewExpense({ category: '', description: '', amount: 0 });
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteExpense = async (expenseId) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            await apiCall(`/weddings/${weddingId}/expenses/${expenseId}`, {
                method: 'DELETE'
            });
            setExpenses(expenses.filter(e => e._id !== expenseId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading expenses...</div>;

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetTotal = 50000; // You can make this configurable later
    const remaining = budgetTotal - totalSpent;

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Budget & Expenses</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    {showForm ? 'Cancel' : '+ Add Expense'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {/* Budget Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Budget</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>${budgetTotal.toLocaleString()}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#fff5f5', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Spent</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc3545' }}>${totalSpent.toLocaleString()}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#f0fff4', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Remaining</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>${remaining.toLocaleString()}</div>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleAddExpense} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Category (e.g., Venue)"
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                            required
                        />
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Add Expense
                    </button>
                </form>
            )}

            {/* Expenses List */}
            <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0 }}>Transaction History ({expenses.length} items)</h3>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {expenses.map(expense => (
                        <div key={expense._id} style={{ padding: '15px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{expense.description || 'Expense'}</div>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#666' }}>
                                    <span style={{ padding: '2px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>{expense.category}</span>
                                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${expense.amount.toLocaleString()}</div>
                                <button 
                                    onClick={() => deleteExpense(expense._id)}
                                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {expenses.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                            No expenses recorded yet. Add your first expense above.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Expenses;