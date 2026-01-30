import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';

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

    if (loading) return <div style={{padding:'20px'}}>Loading finances...</div>;

    return (
        <div className="page-container">
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            {/* --- TOP HEADER --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2>Expense Tracking</h2>
                    <p style={{ color: '#666', margin: 0 }}>Monitor your wedding budget and expenses</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => { setTempBudget(budget); setShowBudgetModal(true); }}
                        style={{ padding: '10px 20px', background: 'white', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
                        Set Budget
                    </button>
                    <button 
                        onClick={() => setShowExpenseModal(true)}
                        style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        + Add Expense
                    </button>
                </div>
            </div>

            {/* --- 4 STATS CARDS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', borderRadius: '10px', background: 'white', border: '1px solid #eee' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', color:'#666' }}>
                        <span>Total Budget</span> <span>$</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0' }}>
                        ₹{budget.toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Overall allocation</span>
                </div>

                <div style={{ padding: '20px', borderRadius: '10px', background: 'white', border: '1px solid #eee' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', color:'#666' }}>
                        <span>Total Spent</span> <span>↗</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0' }}>
                        ₹{totalSpent.toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: spentPercentage > 100 ? 'red' : '#666' }}>
                        {spentPercentage.toFixed(1)}% of budget
                    </span>
                </div>

                <div style={{ padding: '20px', borderRadius: '10px', background: 'white', border: '1px solid #eee' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', color:'#666' }}>
                        <span>Remaining</span> <span>↘</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0', color: remaining < 0 ? 'red' : 'black' }}>
                        ₹{remaining.toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Available</span>
                </div>

                <div style={{ padding: '20px', borderRadius: '10px', background: 'white', border: '1px solid #eee' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', color:'#666' }}>
                        <span>Expenses</span> <span>#</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {expenses.length}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Total items</span>
                </div>
            </div>

            {/* --- EXPENSES LIST --- */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                <h3>Expense Overview</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>Track spending across categories</p>

                {expenses.length === 0 ? (
                    <p style={{ textAlign:'center', color:'#999' }}>No expenses added yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {expenses.map((expense) => {
                            const barWidth = budget > 0 ? (Number(expense.amount) / budget) * 100 : 0;
                            
                            return (
                                <div key={expense._id} style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div>
                                            <span style={{ fontWeight: '500' }}>{expense.description || 'Expense'}</span>
                                            <span style={{color:'#999', fontSize:'0.8rem', marginLeft: '10px'}}>({expense.category})</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontWeight: 'bold' }}>₹{Number(expense.amount).toLocaleString()}</span>
                                            <button 
                                                onClick={() => deleteExpense(expense._id)}
                                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                                        Added on {new Date(expense.date).toLocaleDateString()}
                                    </div>
                                    
                                    <div style={{ width: '100%', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: `${Math.min(barWidth, 100)}%`, 
                                            height: '100%', 
                                            background: '#007bff',
                                            borderRadius: '4px'
                                        }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- MODAL 1: SET BUDGET --- */}
            {showBudgetModal && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h3>Set Total Budget</h3>
                        <form onSubmit={handleSetBudget}>
                            <input 
                                type="number" 
                                value={tempBudget}
                                onChange={e => setTempBudget(e.target.value)}
                                style={inputStyle}
                                placeholder="e.g. 50000"
                            />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="submit" style={btnStyle}>Save Budget</button>
                                <button type="button" onClick={() => setShowBudgetModal(false)} style={cancelBtnStyle}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: ADD EXPENSE --- */}
            {showExpenseModal && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h3>Add New Expense</h3>
                        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                type="text" 
                                placeholder="Description (e.g. Venue Deposit)" 
                                required
                                value={newExpense.description} 
                                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                                style={inputStyle}
                            />
                            <input 
                                type="number" 
                                placeholder="Amount" 
                                required
                                value={newExpense.amount} 
                                onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                                style={inputStyle}
                            />
                            <select 
                                value={newExpense.category} 
                                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                                style={inputStyle}
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
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={btnStyle}>Add Expense</button>
                                <button type="button" onClick={() => setShowExpenseModal(false)} style={cancelBtnStyle}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Internal CSS for Modals ---
const modalStyle = { position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center' };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '10px', width: '400px' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' };
const btnStyle = { flex: 1, padding: '10px', background: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelBtnStyle = { flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Expenses;