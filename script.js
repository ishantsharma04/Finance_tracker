// API Configuration
const API_URL = "https://ai-expense-tracker-backend-b6es.onrender.com/api";

// Data Storage
let financeData = {
    balance: 0,
    initialBalance: 0,
    transactions: [],
    monthlyBudget: 0,
    savingsGoal: 20,
    categories: {},
    goals: [],
    achievements: []
};

// Category mapping with emojis
const categoryMapping = {
    // Shopping & Retail
    'amazon': { name: 'Shopping', emoji: '🛒' },
    'flipkart': { name: 'Shopping', emoji: '🛒' },
    'myntra': { name: 'Shopping', emoji: '👕' },
    'ajio': { name: 'Shopping', emoji: '👕' },
    'shopping': { name: 'Shopping', emoji: '🛒' },
    'mall': { name: 'Shopping', emoji: '🛒' },
    'store': { name: 'Shopping', emoji: '🛒' },
    
    // Food & Dining
    'zomato': { name: 'Food & Dining', emoji: '🍔' },
    'swiggy': { name: 'Food & Dining', emoji: '🍕' },
    'restaurant': { name: 'Food & Dining', emoji: '🍽️' },
    'cafe': { name: 'Food & Dining', emoji: '☕' },
    'food': { name: 'Food & Dining', emoji: '🍔' },
    'dominos': { name: 'Food & Dining', emoji: '🍕' },
    'kfc': { name: 'Food & Dining', emoji: '🍗' },
    'mcdonald': { name: 'Food & Dining', emoji: '🍟' },
    
    // Transportation
    'uber': { name: 'Transportation', emoji: '🚗' },
    'ola': { name: 'Transportation', emoji: '🚕' },
    'rapido': { name: 'Transportation', emoji: '🏍️' },
    'petrol': { name: 'Transportation', emoji: '⛽' },
    'fuel': { name: 'Transportation', emoji: '⛽' },
    'metro': { name: 'Transportation', emoji: '🚇' },
    'bus': { name: 'Transportation', emoji: '🚌' },
    'taxi': { name: 'Transportation', emoji: '🚖' },
    
    // Entertainment
    'netflix': { name: 'Entertainment', emoji: '🎬' },
    'prime': { name: 'Entertainment', emoji: '📺' },
    'spotify': { name: 'Entertainment', emoji: '🎵' },
    'movie': { name: 'Entertainment', emoji: '🎥' },
    'game': { name: 'Entertainment', emoji: '🎮' },
    'youtube': { name: 'Entertainment', emoji: '📹' },
    
    // Utilities & Bills
    'electricity': { name: 'Utilities', emoji: '💡' },
    'water': { name: 'Utilities', emoji: '💧' },
    'internet': { name: 'Utilities', emoji: '🌐' },
    'mobile': { name: 'Utilities', emoji: '📱' },
    'recharge': { name: 'Utilities', emoji: '📱' },
    'bill': { name: 'Utilities', emoji: '📄' },
    'airtel': { name: 'Utilities', emoji: '📱' },
    'jio': { name: 'Utilities', emoji: '📱' },
    
    // Healthcare
    'pharmacy': { name: 'Healthcare', emoji: '💊' },
    'hospital': { name: 'Healthcare', emoji: '🏥' },
    'doctor': { name: 'Healthcare', emoji: '👨‍⚕️' },
    'medicine': { name: 'Healthcare', emoji: '💊' },
    'health': { name: 'Healthcare', emoji: '❤️' },
    
    // Education
    'course': { name: 'Education', emoji: '📚' },
    'book': { name: 'Education', emoji: '📖' },
    'udemy': { name: 'Education', emoji: '🎓' },
    'coursera': { name: 'Education', emoji: '🎓' },
    'school': { name: 'Education', emoji: '🏫' },
    'college': { name: 'Education', emoji: '🎓' },
    
    // Income sources
    'salary': { name: 'Income', emoji: '💰' },
    'credited': { name: 'Income', emoji: '💰' },
    'refund': { name: 'Income', emoji: '💰' },
    'cashback': { name: 'Income', emoji: '💰' },
    'bonus': { name: 'Income', emoji: '💰' },
    'freelance': { name: 'Income', emoji: '💰' }
};

// Achievements definitions
const achievementDefinitions = [
    { id: 'first_transaction', name: 'First Step', emoji: '👶', description: 'Add your first transaction' },
    { id: 'week_streak', name: 'Week Warrior', emoji: '🔥', description: 'Track expenses for 7 days' },
    { id: 'budget_keeper', name: 'Budget Keeper', emoji: '🎯', description: 'Stay within budget for a month' },
    { id: 'savings_star', name: 'Savings Star', emoji: '⭐', description: 'Save 20% of income' },
    { id: 'no_spend_day', name: 'No Spend Day', emoji: '🏆', description: 'Complete a day without expenses' },
    { id: 'goal_achiever', name: 'Goal Achiever', emoji: '🎉', description: 'Complete your first savings goal' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromServer();
});

// API Functions
async function loadDataFromServer() {
    try {
        const response = await fetch(`${API_URL}/data`);
        const data = await response.json();
        
        if (data.success && data.data) {
            financeData = data.data;
            updateGoalsProgress();   // recalc goals
            updateUI();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Backend not reachable. Running in offline mode.', 'warning');
        updateUI();
    }
}

async function saveDataToServer() {
    try {
        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(financeData)
        });
        const result = await response.json();
        if (!result.success) throw new Error('Failed to save data');
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Changes saved locally only (backend offline)', 'warning');
    }
}

// Open/Close modals
function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');
    document.getElementById('initialBalance').value = financeData.initialBalance || '';
    document.getElementById('monthlyBudget').value = financeData.monthlyBudget || '';
    document.getElementById('savingsGoal').value = financeData.savingsGoal || 20;
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('active');
}

function openGoals() {
    const modal = document.getElementById('goalsModal');
    modal.classList.add('active');
    updateGoalsList();
}

function closeGoals() {
    const modal = document.getElementById('goalsModal');
    modal.classList.remove('active');
}

// Save settings
async function saveSettings() {
    const initialBalance = parseFloat(document.getElementById('initialBalance').value) || 0;
    const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
    const savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 20;
    
    financeData.initialBalance = initialBalance;
    financeData.monthlyBudget = monthlyBudget;
    financeData.savingsGoal = savingsGoal;
    
    // Recalculate balance
    const totalIncome = financeData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = financeData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    financeData.balance = initialBalance + totalIncome - totalExpenses;
    
    updateGoalsProgress(); 
    await saveDataToServer();
    updateUI();
    closeSettings();
    
    showNotification('Settings saved successfully!', 'success');
}

async function resetData() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        try {
            const response = await fetch(`${API_URL}/reset`, { method: 'POST' });
            const result = await response.json();
            if (result.success) {
                financeData = {
                    balance: 0,
                    initialBalance: 0,
                    transactions: [],
                    monthlyBudget: 0,
                    savingsGoal: 20,
                    categories: {},
                    goals: [],
                    achievements: []
                };
                updateGoalsProgress(); 
                updateUI();
                closeSettings();
                showNotification('All data has been reset!', 'success');
            }
        } catch (error) {
            console.error('Error resetting data:', error);
            showNotification('Error resetting data (backend offline)', 'error');
        }
    }
}

// Process SMS/UPI notification
async function processTransaction() {
    const smsText = document.getElementById('smsInput').value.trim();
    
    if (!smsText) {
        showNotification('Please enter a transaction message!', 'error');
        return;
    }
    
    const transaction = parseTransaction(smsText);
    
    if (transaction) {
        financeData.transactions.unshift(transaction);
        
        if (transaction.type === 'income') {
            financeData.balance += transaction.amount;
        } else {
            financeData.balance -= transaction.amount;
        }
        
        if (transaction.type === 'expense') {
            if (!financeData.categories[transaction.category]) {
                financeData.categories[transaction.category] = {
                    total: 0,
                    count: 0,
                    emoji: transaction.emoji
                };
            }
            financeData.categories[transaction.category].total += transaction.amount;
            financeData.categories[transaction.category].count += 1;
        }
        
        checkAchievements();

        updateGoalsProgress(); 
        
        await saveDataToServer();
        
        updateUI();
        document.getElementById('smsInput').value = '';
        showNotification('Transaction added successfully!', 'success');
    } else {
        showNotification('Could not parse transaction. Please check the format!', 'error');
    }
}

// Parse transaction from SMS text
function parseTransaction(text) {
    const lowerText = text.toLowerCase();
    
    const isDebit = /debited|debit|paid|spent|withdrawn/i.test(text);
    const isCredit = /credited|credit|received|deposited/i.test(text);
    
    const amountMatch = text.match(/(?:rs\.?|₹)\s*([0-9,]+(?:\.[0-9]{2})?)/i) || 
                       text.match(/([0-9,]+(?:\.[0-9]{2})?)\s*(?:rs\.?|₹)/i);
    
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    
    let category = 'Others';
    let emoji = '💳';
    
    for (const [keyword, catInfo] of Object.entries(categoryMapping)) {
        if (lowerText.includes(keyword)) {
            category = catInfo.name;
            emoji = catInfo.emoji;
            break;
        }
    }
    
    let description = 'Transaction';
    const merchantMatch = text.match(/(?:to|from|at)\s+([A-Za-z0-9\s]+?)(?:\.|on|upi|a\/c)/i);
    if (merchantMatch) {
        description = merchantMatch[1].trim();
    } else {
        const words = text.split(/\s+/);
        const capitalizedWords = words.filter(w => /^[A-Z][a-z]+/.test(w));
        if (capitalizedWords.length > 0) {
            description = capitalizedWords.slice(0, 2).join(' ');
        }
    }
    
    const dateMatch = text.match(/(\d{1,2}[-\/]\w{3}[-\/]\d{2,4})/i) || 
                     text.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
    const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-IN');
    
    return {
        id: Date.now(),
        type: isCredit ? 'income' : 'expense',
        amount: amount,
        category: category,
        emoji: emoji,
        description: description,
        date: date,
        originalText: text
    };
}

// Check and unlock achievements
function checkAchievements() {
    const newAchievements = [];
    
    if (financeData.transactions.length === 1 && !hasAchievement('first_transaction')) {
        newAchievements.push('first_transaction');
    }
    
    const today = new Date().toLocaleDateString('en-IN');
    const todayExpenses = financeData.transactions.filter(t => 
        t.type === 'expense' && t.date === today
    );
    if (todayExpenses.length === 0 && financeData.transactions.length > 0 && !hasAchievement('no_spend_day')) {
        newAchievements.push('no_spend_day');
    }
    
    const totalIncome = financeData.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = financeData.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    if (savingsRate >= 20 && !hasAchievement('savings_star')) {
        newAchievements.push('savings_star');
    }
    
    newAchievements.forEach(achievementId => {
        if (!financeData.achievements) {
            financeData.achievements = [];
        }
        financeData.achievements.push({
            id: achievementId,
            unlockedAt: new Date().toISOString()
        });
        
        const achievement = achievementDefinitions.find(a => a.id === achievementId);
        if (achievement) {
            showNotification(`Achievement Unlocked: ${achievement.name}!`, 'success');
        }
    });
}

function hasAchievement(achievementId) {
    if (!financeData.achievements) return false;
    return financeData.achievements.some(a => a.id === achievementId);
}

// Goals management
async function addGoal() {
    const name = document.getElementById('goalName').value.trim();
    const amount = parseFloat(document.getElementById('goalAmount').value);
    const deadline = document.getElementById('goalDeadline').value;
    
    if (!name || !amount || !deadline) {
        showNotification('Please fill all goal fields!', 'error');
        return;
    }
    
    const goal = {
        id: Date.now(),
        name: name,
        targetAmount: amount,
        currentAmount: 0,
        deadline: deadline,
        createdAt: new Date().toISOString()
    };
    
    if (!financeData.goals) {
        financeData.goals = [];
    }
    
    financeData.goals.push(goal);
    
    updateGoalsProgress(); 
    await saveDataToServer();
    updateGoalsList();
    
    document.getElementById('goalName').value = '';
    document.getElementById('goalAmount').value = '';
    document.getElementById('goalDeadline').value = '';
    
    showNotification('Goal added successfully!', 'success');
}

// ---------------- REMOVE GOAL ----------------
async function removeGoal(goalId) {
    // Filter out the goal
    financeData.goals = financeData.goals.filter(g => g.id !== goalId);

    // Recalculate progress across remaining goals
    updateGoalsProgress();

    // Save to server & update UI
    await saveDataToServer();
    updateGoalsList();
    showNotification('Goal removed successfully!', 'success');
}


// ---------------- UPDATE GOALS LIST ----------------
function updateGoalsList() {
    const container = document.getElementById('goalsList');
    
    if (!financeData.goals || financeData.goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎯</span>
                <p>No goals yet. Add your first savings goal!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = financeData.goals.map(goal => {
        const progress = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
        const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        
            return `
        <div class="goal-card">
            <div class="goal-header">
                <div class="goal-name">${goal.name}</div>
                <div class="goal-amount">₹${Number(goal.targetAmount).toFixed(2)}</div>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="goal-meta">
                <span>Saved: ₹${Number(goal.currentAmount).toFixed(2)}</span>
                <span>Remaining: ₹${remaining.toFixed(2)}</span>
            </div>
            <div class="goal-meta">
                <span>${daysLeft} days left</span>
                <span>${progress.toFixed(1)}% complete</span>
            </div>
            ${progress >= 100 ? `
                <div class="goal-actions">
                    <button class="btn-secondary" onclick="removeGoal(${goal.id})">
                        <span>🗑️</span> Remove Goal
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    }).join('');
}


// Update UI
function updateUI() {
    updateDashboard();
    updateAchievements();
    updateInsights();
    updatePatterns();
    updateCategories();
    updateTransactionsList();
}

// ---------------- UPDATE DASHBOARD ----------------
function updateDashboard() {
    const totalIncome = financeData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = financeData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const savingsRate = totalIncome > 0 ?
        (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

    document.getElementById('totalBalance').textContent = `₹${Number(financeData.balance).toFixed(2)}`;
    document.getElementById('totalIncome').textContent = `₹${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById('savingsRate').textContent = `${savingsRate}%`;
}

function updateAchievements() {
    const container = document.getElementById('achievementsContainer');
    
    if (!financeData.achievements || financeData.achievements.length === 0) {
        container.innerHTML = `
            <div class="achievement-card locked">
                <span class="achievement-icon">🔒</span>
                <p>Start tracking to unlock badges!</p>
            </div>
        `;
        return;
    }
    
    const unlockedIds = financeData.achievements.map(a => a.id);
    
    container.innerHTML = achievementDefinitions.map(achievement => {
        const isUnlocked = unlockedIds.includes(achievement.id);
        return `
            <div class="achievement-card ${isUnlocked ? '' : 'locked'}">
                <span class="achievement-icon">${isUnlocked ? achievement.emoji : '🔒'}</span>
                <p><strong>${achievement.name}</strong></p>
                <p style="font-size: 0.8rem; margin-top: 5px;">${achievement.description}</p>
            </div>
        `;
    }).join('');
}

// ---------------- UPDATE GOALS PROGRESS ----------------
function updateGoalsProgress() {
    if (!financeData.goals || financeData.goals.length === 0) return;

    // Compute income/expenses/savings
    const totalIncome = financeData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = financeData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalSavings = Math.max(0, totalIncome - totalExpenses);
    const savingsTarget = (Number(financeData.savingsGoal || 0) / 100) * totalIncome;

    // We will allocate up to the savings target (don't over-allocate)
    const actualSavings = Math.min(totalSavings, savingsTarget);

    // Consider only goals with a positive targetAmount
    const goals = financeData.goals.filter(g => Number(g.targetAmount) > 0);
    if (goals.length === 0) return;

    // Start fresh: clear currentAmount for recalculation (recompute from scratch)
    goals.forEach(g => { g.currentAmount = 0; });

    // Distribute actualSavings equally among goals, cap at each goal's target.
    let remaining = actualSavings;
    let uncapped = goals.slice(); // shallow copy

    // Loop to equally distribute and handle capping / redistribution
    while (remaining > 0 && uncapped.length > 0) {
        const share = remaining / uncapped.length;
        let cappedAny = false;

        for (let i = 0; i < uncapped.length; i++) {
            const g = uncapped[i];
            const canAccept = Number(g.targetAmount) - Number(g.currentAmount || 0);
            const add = Math.min(share, canAccept);
            g.currentAmount = Number(g.currentAmount || 0) + add;
            remaining -= add;
            if (add === canAccept) cappedAny = true;
        }

        // If no goal was capped in this pass, break to avoid infinite loop
        if (!cappedAny) break;

        // Recompute uncapped list
        uncapped = uncapped.filter(g => Number(g.currentAmount) < Number(g.targetAmount));
    }

    // Final safety: clamp and round to 2 decimals
    financeData.goals.forEach(g => {
        g.currentAmount = Math.min(Number(g.targetAmount), Number(g.currentAmount || 0));
        g.currentAmount = Number(g.currentAmount.toFixed(2));
    });
}


function detectPatterns() {
    const patterns = [];

    if (financeData.transactions.length === 0) return patterns;

    // Get the most recent transaction
    const latest = financeData.transactions[0];

    // --- Transportation Pattern ---
    if (latest.category === 'Transportation') {
        const total = financeData.transactions
            .filter(t => t.category === 'Transportation')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        patterns.push({
            icon: '🚕',
            message: `Latest spend: Transportation (₹${Number(latest.amount).toFixed(2)}). Total so far: ₹${total.toFixed(2)}.`
        });
    }

    // --- Entertainment Pattern ---
    if (latest.category === 'Entertainment') {
        const total = financeData.transactions
            .filter(t => t.category === 'Entertainment')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        patterns.push({
            icon: '🎮',
            message: `Latest spend: Entertainment (₹${Number(latest.amount).toFixed(2)}). Total so far: ₹${total.toFixed(2)}.`
        });
    }

    // --- Budget Usage Pattern ---
    if (financeData.monthlyBudget > 0) {
        const totalExpenses = financeData.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const budgetUsed = (totalExpenses / financeData.monthlyBudget) * 100;
        patterns.push({
            icon: budgetUsed > 90 ? '⚠️' : '📊',
            message: `You've used ${budgetUsed.toFixed(0)}% of your monthly budget.`
        });
    }

    // --- Generic fallback if no special category ---
    if (patterns.length === 0) {
        patterns.push({
            icon: '💡',
            message: `Latest transaction: ${latest.category} (₹${Number(latest.amount).toFixed(2)}).`
        });
    }

    return patterns;
}



function updatePatterns() {
    const container = document.getElementById('patternsContainer');
    const patterns = detectPatterns();
    
    if (patterns.length === 0) {
        container.innerHTML = `
            <div class="pattern-card">
                <span class="pattern-icon">💡</span>
                <p>No patterns yet — add a transaction to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = patterns.map(pattern => `
        <div class="pattern-card">
            <span class="pattern-icon">${pattern.icon}</span>
            <p>${pattern.message}</p>
        </div>
    `).join('');
}


function updateInsights() {
    const container = document.getElementById('insightsContainer');
    const insights = generateInsights();
    
    if (insights.length === 0) {
        container.innerHTML = `
            <div class="insight-card">
                <span class="insight-icon">💡</span>
                <p>Add transactions to get personalized insights!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <span class="insight-icon">${insight.icon}</span>
            <p>${insight.message}</p>
        </div>
    `).join('');
}

function generateInsights() {
    const insights = [];
    
    if (financeData.transactions.length === 0) return insights;
    
    const totalIncome = financeData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = financeData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    if (financeData.monthlyBudget > 0) {
        const budgetUsed = (totalExpenses / financeData.monthlyBudget) * 100;
        if (budgetUsed > 90) {
            insights.push({
                icon: '⚠️',
                type: 'warning',
                message: `You've used ${budgetUsed.toFixed(0)}% of your monthly budget! Consider reducing expenses.`
            });
        } else if (budgetUsed < 50) {
            insights.push({
                icon: '🎉',
                type: 'success',
                message: `Great job! You've only used ${budgetUsed.toFixed(0)}% of your monthly budget.`
            });
        }
    }
    
    const currentSavingsRate = totalIncome > 0 ? 
        ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    if (currentSavingsRate < financeData.savingsGoal) {
        const amountToSave = ((totalIncome * financeData.savingsGoal / 100) - (totalIncome - totalExpenses));
        insights.push({
            icon: '📊',
            type: 'warning',
            message: `Your savings rate is ${currentSavingsRate.toFixed(1)}%, below your goal of ${financeData.savingsGoal}%. Save ₹${amountToSave.toFixed(0)} more to reach your target.`
        });
    } else {
        insights.push({
            icon: '🎯',
            type: 'success',
            message: `Excellent! You're saving ${currentSavingsRate.toFixed(1)}% of your income, exceeding your ${financeData.savingsGoal}% goal.`
        });
    }
    
    if (financeData.balance < 1000 && financeData.balance > 0) {
        insights.push({
            icon: '💰',
            type: 'warning',
            message: `Your balance is low (₹${financeData.balance.toFixed(2)}). Build an emergency fund.`
        });
    }
    
    return insights;
}

// ---------------- UPDATE CATEGORIES ----------------
function updateCategories() {
    const container = document.getElementById('categoriesGrid');
    const categories = Object.entries(financeData.categories);
    
    if (categories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📦</span>
                <p>No expenses yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = categories.map(([name, data]) => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-name">
                    <span>${data.emoji}</span>
                    <span>${name}</span>
                </div>
            </div>
            <div class="category-amount">₹${Number(data.total).toFixed(2)}</div>
            <div class="category-count">${data.count} transactions</div>
        </div>
    `).join('');
}


// ---------------- UPDATE TRANSACTIONS LIST ----------------
function updateTransactionsList() {
    const container = document.getElementById('transactionsList');
    
    if (financeData.transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔭</span>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = financeData.transactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">${t.emoji}</div>
                <div class="transaction-details">
                    <h4>${t.description}</h4>
                    <div class="transaction-meta">
                        <span>${t.category}</span>
                        <span>${t.date}</span>
                    </div>
                </div>
            </div>
            <div class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}₹${Number(t.amount).toFixed(2)}
            </div>
        </div>
    `).join('');
}


// ---------------- FILTER TRANSACTIONS ----------------
function filterTransactions(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const container = document.getElementById('transactionsList');
    let filtered = financeData.transactions;
    
    if (type !== 'all') {
        filtered = financeData.transactions.filter(t => t.type === type);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔭</span>
                <p>No ${type} transactions</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">${t.emoji}</div>
                <div class="transaction-details">
                    <h4>${t.description}</h4>
                    <div class="transaction-meta">
                        <span>${t.category}</span>
                        <span>${t.date}</span>
                    </div>
                </div>
            </div>
            <div class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}₹${Number(t.amount).toFixed(2)}
            </div>
        </div>
    `).join('');
}


function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--warning)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// --- Voice Recognition ---
const voiceBtn = document.getElementById("voiceBtn");

if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-IN"; // Indian English for ₹/Rs

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    voiceBtn.innerText = "🎤 Listening...";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Voice input:", transcript);

    // Send transcript for parsing
    processSpokenTransaction(transcript);

    voiceBtn.innerText = "🎤 Speak Transaction";
  };

  recognition.onerror = (event) => {
    console.error("Speech error:", event.error);
    voiceBtn.innerText = "🎤 Speak Transaction";
  };

  recognition.onend = () => {
    voiceBtn.innerText = "🎤 Speak Transaction";
  };
} else {
  voiceBtn.style.display = "none"; // Hide button if not supported
  console.warn("Web Speech API not supported in this browser");
}


// --- Parser for spoken text ---
function processSpokenTransaction(text) {
  // 🟢 Step 1: Put the spoken text into the SMS input box
  document.getElementById("smsInput").value = text;

  // 🟢 Step 2: Parse into transaction
  let type = "expense";
  if (text.toLowerCase().includes("received") || text.toLowerCase().includes("credited")) {
    type = "income";
  }

  const amountMatch = text.match(/(\d+(\.\d+)?)/);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

  let merchant = "Unknown";
  const merchantMatch = text.match(/at\s+([A-Za-z0-9]+)/i);
  if (merchantMatch) {
    merchant = merchantMatch[1];
  }

  const tx = {
    id: Date.now(),
    type: type,
    amount: amount,
    category: "Other",
    merchant: merchant,
    date: new Date().toLocaleString()
  };

  console.log("Parsed voice transaction:", tx);

  // 🟢 Step 3: Render on frontend
  if (typeof renderTransactions === "function") {
    renderTransactions([tx]);
  }
}

let notificationInterval = null;

function startMockNotifications() {
    if (notificationInterval) return; // already running

    showNotification("📩 Starting mock notifications...", "info");

    notificationInterval = setInterval(async () => {
        try {
            const res = await fetch(`${API_URL}/next-notification`);
            const json = await res.json();

            if (json.success) {
                processTransactionFromNotification(json.notification);
            } else {
                clearInterval(notificationInterval);
                notificationInterval = null;
                showNotification("✅ All mock notifications processed!", "success");
            }
        } catch (err) {
            console.error("Error fetching mock notification:", err);
        }
    }, 5000); // every 5s
}

function processTransactionFromNotification(message) {
    document.getElementById("smsInput").value = message;
    processTransaction(); // reuse existing parser
}

function showMockPopup(message) {
    const popup = document.createElement("div");
    popup.className = "notification-popup";
    popup.textContent = message;
    document.body.appendChild(popup);
    popup.style.display = "block";

    setTimeout(() => popup.remove(), 3000);
}

// Chat toggle
document.getElementById("chat-toggle").addEventListener("click", () => {
    document.getElementById("chat-box").style.display = "flex";
    document.getElementById("chat-toggle").style.display = "none";
});

document.getElementById("chat-close").addEventListener("click", () => {
    document.getElementById("chat-box").style.display = "none";
    document.getElementById("chat-toggle").style.display = "block";
});

// Send message
document.getElementById("chat-send").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

function appendMessage(sender, text) {
    const msgContainer = document.createElement("div");
    msgContainer.textContent = sender + ": " + text;
    document.getElementById("chat-messages").appendChild(msgContainer);
    document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("You", message);
    input.value = "";

    // Call AI backend (dummy for now)
    appendMessage("AI", "🤖 Thinking...");

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_API_KEY"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Or GPT-3.5/other model
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await res.json();
        const reply = data.choices[0].message.content;
        
        document.getElementById("chat-messages").lastChild.textContent = "AI: " + reply;
    } catch (err) {
        document.getElementById("chat-messages").lastChild.textContent = "AI: ❌ Error connecting to AI.";
        console.error(err);
    }
}
