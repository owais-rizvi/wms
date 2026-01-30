import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';
import './Expenses.css';

function Expenses() {
    const navigate = useNavigate();

    // --- STATE ---
    const [budget, setBudget] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modals
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    // Forms
    const [tempBudget, setTempBudget] = useState(0);
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

    // --- CALCULATIONS ---
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const remaining = budget - totalSpent;
    const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

    // --- FETCH DATA ---
    const fetchData = async () => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            // Fetch both wedding details and expenses
            const [weddingRes, expensesRes] = await Promise.all([
                apiCall(`/weddings/${weddingId}`),
                apiCall(`/weddings/${weddingId}/expenses`)
            ]);
            
            setBudget(weddingRes.budget || 0);
            setTempBudget(weddingRes.budget || 0);
            setExpenses(expensesRes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- HANDLE UPDATES ---
    const handleSetBudget = async (e) => {
        e.preventDefault();
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            await apiCall(`/weddings/${weddingId}`, {
                method: 'PUT',
                body: JSON.stringify({ budget: Number(tempBudget) })
            });
            setBudget(Number(tempBudget));
            setShowBudgetModal(false);
        } catch (err) {
            setError(err.message);
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
            setShowExpenseModal(false);
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

    if (loading) return <div className="loading-state">Loading finances...</div>;

    return (
        <div className="page-container">
            {error && <div className="error-message">{error}</div>}
            
            {/* --- TOP HEADER --- */}
            <div className="expenses-header">
                <div>
                    <h2 style={{ color: '#540c21', margin: 0 }}>Expense Tracking</h2>
                    <p style={{ color: '#666', margin: '5px 0 0' }}>Monitor your wedding budget</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-secondary"
                        onClick={() => { setTempBudget(budget); setShowBudgetModal(true); }}
                    >
                        Set Budget
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowExpenseModal(true)}
                    >
                        + Add Expense
                    </button>
                </div>
            </div>

            {/* --- 4 STATS CARDS --- */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="card-label">Total Budget</div>
                    <div className="card-value">₹{budget.toLocaleString()}</div>
                    <div className="card-subtext">Allocated</div>
                </div>

                <div className="stat-card">
                    <div className="card-label">Total Spent</div>
                    <div className="card-value">₹{totalSpent.toLocaleString()}</div>
                    <div className={`card-subtext ${spentPercentage > 100 ? 'text-danger' : ''}`}>
                        {spentPercentage.toFixed(1)}% of budget
                    </div>
                </div>

                <div className="stat-card">
                    <div className="card-label">Remaining</div>
                    <div className={`card-value ${remaining < 0 ? 'text-danger' : ''}`}>
                        ₹{remaining.toLocaleString()}
                    </div>
                    <div className="card-subtext">Available</div>
                </div>

                <div className="stat-card">
                    <div className="card-label">Expenses</div>
                    <div className="card-value">{expenses.length}</div>
                    <div className="card-subtext">Items added</div>
                </div>
            </div>

            {/* --- EXPENSES LIST --- */}
            <div className="expenses-list-container">
                <h3 className="section-title">Expense History</h3>
                
                {expenses.length === 0 ? (
                    <div className="empty-state">No expenses added yet.</div>
                ) : (
                    <div className="expenses-list">
                        {expenses.map((expense) => {
                            const barWidth = budget > 0 ? (Number(expense.amount) / budget) * 100 : 0;
                            
                            return (
                                <div key={expense._id} className="expense-item">
                                    <div className="expense-row-top">
                                        <div className="expense-info">
                                            <h4>{expense.description || 'Expense'}</h4>
                                            <span className="expense-category">{expense.category}</span>
                                            <span className="expense-date"> • {new Date(expense.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="expense-amount-row">
                                            <span className="amount-text">₹{Number(expense.amount).toLocaleString()}</span>
                                            <button 
                                                className="btn-text-delete"
                                                onClick={() => deleteExpense(expense._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="expense-progress-track">
                                        <div 
                                            className="expense-progress-fill"
                                            style={{ width: `${Math.min(barWidth, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- MODAL 1: SET BUDGET --- */}
            {showBudgetModal && (
                <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Set Total Budget</h3>
                            <button className="btn-close" onClick={() => setShowBudgetModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSetBudget}>
                            <div className="form-group">
                                <label>Total Budget Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={tempBudget}
                                    onChange={e => setTempBudget(e.target.value)}
                                    placeholder="e.g. 500000"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Budget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: ADD EXPENSE --- */}
            {showExpenseModal && (
                <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Expense</h3>
                            <button className="btn-close" onClick={() => setShowExpenseModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddExpense}>
                            <div className="form-group">
                                <label>Description</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Venue Deposit" 
                                    required
                                    value={newExpense.description} 
                                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                                    autoFocus
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        required
                                        value={newExpense.amount} 
                                        onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select 
                                        value={newExpense.category} 
                                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Venue">Venue</option>
                                        <option value="Catering">Catering</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Attire">Attire</option>
                                        <option value="Flowers">Flowers</option>
                                        <option value="Music">Music</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Expenses;