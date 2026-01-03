import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Clock, 
  FileText, 
  DollarSign, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Briefcase,
  UserCircle,
  Settings,
  Plus,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Award,
  MessageSquare
} from 'lucide-react';

/**
 * MOCK DATA & INITIAL STATE
 */
const INITIAL_USERS = [
  {
    id: 1,
    name: 'Admin Manager',
    email: 'admin@dayflow.com',
    password: 'admin123',
    role: 'Admin',
    department: 'Human Resources',
    avatar: 'AM',
    phone: '+1 (555) 012-3456',
    address: '123 SkyNet Ave, Tech City',
    salary: 95000
  },
  {
    id: 2,
    name: 'Sujal',
    email: 'sujal@dayflow.com',
    password: 'user123',
    role: 'Employee',
    department: 'Engineering',
    avatar: 'S',
    phone: '+91 98765 43210',
    address: '456 Code Lane, Dev Valley',
    salary: 75000,
    streak: 15
  },
  {
    id: 3,
    name: 'Emily Blunt',
    email: 'emily@dayflow.com',
    password: 'user123',
    role: 'Employee',
    department: 'Design',
    avatar: 'EB',
    phone: '+1 (555) 111-2222',
    address: '789 Art St, Creative Town',
    salary: 72000,
    streak: 8
  }
];

const INITIAL_ATTENDANCE = [
  { id: 101, userId: 2, date: '2023-10-24', status: 'Present', checkIn: '09:00 AM', checkOut: '05:00 PM' },
  { id: 102, userId: 2, date: '2023-10-25', status: 'Present', checkIn: '09:15 AM', checkOut: '05:10 PM' },
  { id: 103, userId: 3, date: '2023-10-25', status: 'Absent', checkIn: '-', checkOut: '-' },
  { id: 104, userId: 2, date: '2023-10-26', status: 'Half-day', checkIn: '09:00 AM', checkOut: '01:00 PM' },
];

const INITIAL_LEAVES = [
  { id: 201, userId: 2, type: 'Sick Leave', startDate: '2023-11-01', endDate: '2023-11-03', reason: 'Flu', status: 'Approved' },
  { id: 202, userId: 3, type: 'Paid Leave', startDate: '2023-12-20', endDate: '2023-12-25', reason: 'Vacation', status: 'Pending' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, userId: 2, msg: "Your leave for Oct 24 was approved.", time: "2 hours ago", read: false, type: "success" },
  { id: 2, userId: 2, msg: "Welcome to Dayflow! Please complete your profile.", time: "1 day ago", read: true, type: "info" },
  { id: 3, userId: 1, msg: "New leave request from Emily Blunt.", time: "30 mins ago", read: false, type: "alert" }
];

/**
 * MAIN APP COMPONENT
 */
export default function DayflowApp() {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null); // Current logged in user
  const [view, setView] = useState('dashboard'); // Current active tab
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Database State (Simulated)
  const [users, setUsers] = useState(INITIAL_USERS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);
  
  // Notification State
  const [toasts, setToasts] = useState([]); // Temporary popups
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS); // Persistent history
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // --- HELPERS ---
  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    
    // Also add to persistent history
    if (user) {
      const newNotif = {
        id: Date.now(),
        userId: user.id,
        msg: msg,
        time: "Just now",
        read: false,
        type: type === 'error' ? 'alert' : type
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setView('dashboard');
      addToast(`Welcome back, ${foundUser.name}!`, 'success');
    } else {
      addToast('Invalid credentials. Try sujal@dayflow.com', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setShowNotifPanel(false);
  };

  const markNotificationsRead = () => {
    if (!user) return;
    setNotifications(notifications.map(n => n.userId === user.id ? { ...n, read: true } : n));
  };

  // --- RENDER LOGIC ---
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const unreadCount = notifications.filter(n => n.userId === user.id && !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
      {/* Toast Popups (Top Right) */}
      <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map(n => (
          <div key={n.id} className={`px-4 py-3 rounded shadow-lg text-white text-sm font-medium animate-fade-in-down flex items-center gap-2 ${
            n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {n.type === 'success' && <CheckCircle size={16} />}
            {n.type === 'error' && <XCircle size={16} />}
            {n.msg}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">D</div>
            {sidebarOpen && <span>Dayflow</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} isOpen={sidebarOpen} />
          <NavItem icon={<UserCircle size={20} />} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} isOpen={sidebarOpen} />
          <NavItem icon={<Clock size={20} />} label="Attendance" active={view === 'attendance'} onClick={() => setView('attendance')} isOpen={sidebarOpen} />
          <NavItem icon={<CalendarCheck size={20} />} label="Leave & Time-off" active={view === 'leaves'} onClick={() => setView('leaves')} isOpen={sidebarOpen} />
          <NavItem icon={<DollarSign size={20} />} label="Payroll" active={view === 'payroll'} onClick={() => setView('payroll')} isOpen={sidebarOpen} />
          {user.role === 'Admin' && (
            <div className="mt-8 pt-4 border-t border-slate-700">
               <div className={`px-4 text-xs font-semibold text-slate-400 uppercase mb-2 ${!sidebarOpen && 'hidden'}`}>Admin</div>
               <NavItem icon={<Users size={20} />} label="Employees" active={view === 'employees'} onClick={() => setView('employees')} isOpen={sidebarOpen} />
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full p-2 rounded hover:bg-slate-800">
             <LogOut size={20} />
             {sidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50 relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
               <button 
                 onClick={() => { setShowNotifPanel(!showNotifPanel); markNotificationsRead(); }}
                 className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
               >
                 <Bell size={20} className={showNotifPanel ? 'text-blue-600' : 'text-gray-400'} />
                 {unreadCount > 0 && (
                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                 )}
               </button>

               {/* Notification Dropdown Panel */}
               {showNotifPanel && (
                 <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-scale-in origin-top-right">
                   <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold text-gray-700 text-sm">Notifications</h3>
                     <span className="text-xs text-blue-600 font-medium cursor-pointer" onClick={markNotificationsRead}>Mark all read</span>
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                     {notifications.filter(n => n.userId === user.id).length === 0 ? (
                       <div className="p-8 text-center text-gray-400 text-sm">No notifications yet.</div>
                     ) : (
                       notifications.filter(n => n.userId === user.id).map(n => (
                         <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 flex gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                           <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                           <div>
                             <p className="text-sm text-gray-800">{n.msg}</p>
                             <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                   <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
                     <button onClick={() => setShowNotifPanel(false)} className="text-xs text-gray-500 hover:text-gray-800">Close</button>
                   </div>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8" onClick={() => setShowNotifPanel(false)}>
          <div className="max-w-6xl mx-auto">
            {view === 'dashboard' && <DashboardView user={user} attendance={attendance} leaves={leaves} users={users} setView={setView} />}
            {view === 'profile' && <ProfileView user={user} setUser={setUser} addToast={addToast} />}
            {view === 'attendance' && <AttendanceView user={user} attendance={attendance} setAttendance={setAttendance} users={users} addToast={addToast} />}
            {view === 'leaves' && <LeaveView user={user} leaves={leaves} setLeaves={setLeaves} users={users} addToast={addToast} />}
            {view === 'payroll' && <PayrollView user={user} users={users} setUsers={setUsers} addToast={addToast} />}
            {view === 'employees' && <EmployeeListView users={users} />}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * COMPONENT: Sidebar Nav Item
 */
const NavItem = ({ icon, label, active, onClick, isOpen }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className="shrink-0">{icon}</span>
    {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

/**
 * VIEW: Authentication
 */
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('sujal@dayflow.com');
  const [password, setPassword] = useState('user123');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden h-[600px]">
        
        {/* Left Side - Brand */}
        <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Decorative circles */}
             <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
             <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Dayflow</h1>
            <p className="text-blue-100 text-lg">Every workday, perfectly aligned.</p>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><CheckCircle size={20} /></div>
              <div>
                <h3 className="font-bold">Seamless Attendance</h3>
                <p className="text-sm text-blue-100">Check in/out with a single click.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><FileText size={20} /></div>
              <div>
                <h3 className="font-bold">Smart Payroll</h3>
                <p className="text-sm text-blue-100">Automated salary structures.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="text-gray-500 mb-8">{isLogin ? 'Please sign in to continue.' : 'Join the future of HR.'}</p>
          
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Sujal" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                placeholder="name@company.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
            {!isLogin && (
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none">
                  <option>Employee</option>
                  <option>Admin / HR Officer</option>
                </select>
              </div>
            )}
          </div>

          <button 
            onClick={() => isLogin ? onLogin(email, password) : setIsLogin(true)}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400">Demo: <span className="font-mono bg-gray-100 px-1 rounded">sujal@dayflow.com</span> / <span className="font-mono bg-gray-100 px-1 rounded">user123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VIEW: Dashboard
 */
const DashboardView = ({ user, attendance, leaves, users, setView }) => {
  const isEmployee = user.role === 'Employee';
  const [mood, setMood] = useState(null);
  
  // Calculations
  const myLeaves = leaves.filter(l => l.userId === user.id);
  const pendingLeaves = isEmployee ? myLeaves.filter(l => l.status === 'Pending').length : leaves.filter(l => l.status === 'Pending').length;
  const todayStats = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {user.name} 👋</h1>
          <p className="text-gray-500 mt-1">Ready to align your workday?</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-500" />} 
          label={isEmployee ? "My Team" : "Total Employees"} 
          value={isEmployee ? "12 Members" : users.length} 
          trend="+2 this month"
          onClick={() => isEmployee ? null : setView('employees')}
        />
        <StatCard 
          icon={<Clock className="text-green-500" />} 
          label="Attendance Today" 
          value={isEmployee ? "Checked In" : `${todayStats.length}/${users.length} Present`}
          trend="On time"
          onClick={() => setView('attendance')}
        />
        <StatCard 
          icon={<CalendarCheck className="text-purple-500" />} 
          label="Leave Balance" 
          value={isEmployee ? "12 Days" : `${pendingLeaves} Pending`} 
          trend={isEmployee ? "Renewing Jan 1" : "Action Required"}
          onClick={() => setView('leaves')}
          alert={!isEmployee && pendingLeaves > 0}
        />
        <StatCard 
          icon={<TrendingUp className="text-orange-500" />} 
          label="Attendance Streak" 
          value={`${user.streak || 0} Days`} 
          trend="Keep it up!"
        />
      </div>

      {/* Recent Activity / Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Welcome to Dayflow v2.0</h2>
              <p className="text-blue-100 max-w-lg mb-6">Manage your workday efficiently. Check your schedule, apply for leave, and view your payroll slips all in one place.</p>
              <button onClick={() => setView('profile')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                View My Profile
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
              <LayoutDashboard size={200} />
            </div>
          </div>

          {/* Quick Actions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{isEmployee ? 'My Recent Leaves' : 'Pending Leave Approvals'}</h3>
              <button onClick={() => setView('leaves')} className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {(isEmployee ? myLeaves : leaves.filter(l => l.status === 'Pending')).slice(0, 3).map(leave => (
                <div key={leave.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${leave.type === 'Sick Leave' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{isEmployee ? leave.type : users.find(u => u.id === leave.userId)?.name}</p>
                      <p className="text-xs text-gray-500">{leave.startDate} to {leave.endDate}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {leave.status}
                  </span>
                </div>
              ))}
              {leaves.length === 0 && <div className="p-8 text-center text-gray-400">No records found</div>}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Mood Tracker (Unique Feature) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">How are you feeling today?</h3>
            <div className="flex justify-between">
              <button onClick={() => setMood('happy')} className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${mood === 'happy' ? 'bg-green-50 ring-2 ring-green-500' : 'hover:bg-gray-50'}`}>
                <Smile size={32} className="text-green-500" />
                <span className="text-xs font-medium">Great</span>
              </button>
              <button onClick={() => setMood('neutral')} className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${mood === 'neutral' ? 'bg-yellow-50 ring-2 ring-yellow-500' : 'hover:bg-gray-50'}`}>
                <Meh size={32} className="text-yellow-500" />
                <span className="text-xs font-medium">Okay</span>
              </button>
              <button onClick={() => setMood('sad')} className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${mood === 'sad' ? 'bg-red-50 ring-2 ring-red-500' : 'hover:bg-gray-50'}`}>
                <Frown size={32} className="text-red-500" />
                <span className="text-xs font-medium">Tired</span>
              </button>
            </div>
          </div>

          {/* Quick Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-gray-600">
              {user.avatar}
            </div>
            <h3 className="font-bold text-xl">{user.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{user.role} • {user.department}</p>
            <div className="w-full grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <span className="block text-gray-400 text-xs uppercase">Emp ID</span>
                <span className="font-semibold">DF-{user.id.toString().padStart(3,'0')}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <span className="block text-gray-400 text-xs uppercase">Location</span>
                <span className="font-semibold">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, alert, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden ${onClick ? 'active:scale-95 transition-transform' : ''}`}
  >
    {alert && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded mr-2">{trend}</span>
      <span className="text-gray-400">vs last period</span>
    </div>
  </div>
);

/**
 * VIEW: Attendance
 */
const AttendanceView = ({ user, attendance, setAttendance, users, addToast }) => {
  const isAdmin = user.role === 'Admin';
  const today = new Date().toISOString().split('T')[0];
  
  // Find today's record for current user
  const myTodayRecord = attendance.find(a => a.userId === user.id && a.date === today);

  const handleCheckIn = () => {
    if (myTodayRecord) return;
    
    // Late Logic: Check if it's past 9:30 AM
    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
    const status = isLate ? 'Late' : 'Present';

    const newRecord = {
      id: Date.now(),
      userId: user.id,
      date: today,
      status: status,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: '-'
    };
    setAttendance([newRecord, ...attendance]);
    addToast(`Checked in successfully! ${isLate ? '(Late Arrival)' : ''}`, isLate ? 'info' : 'success');
  };

  const handleCheckOut = () => {
    if (!myTodayRecord || myTodayRecord.checkOut !== '-') return;
    const updated = attendance.map(a => {
      if (a.id === myTodayRecord.id) {
        return { ...a, checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      return a;
    });
    setAttendance(updated);
    addToast('Checked out successfully!', 'success');
  };

  const filteredAttendance = isAdmin ? attendance : attendance.filter(a => a.userId === user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <div className="text-sm text-gray-500">{new Date().toDateString()}</div>
      </div>

      {!isAdmin && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-xl mx-auto">
          <div className="mb-6">
            <div className="text-6xl font-mono font-bold text-gray-800 mb-2">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-gray-500">Current Local Time</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              disabled={!!myTodayRecord}
              onClick={handleCheckIn}
              className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${
                myTodayRecord 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105'
              }`}
            >
              {myTodayRecord ? `In at ${myTodayRecord.checkIn}` : 'Check In'}
            </button>
            
            <button 
              disabled={!myTodayRecord || myTodayRecord.checkOut !== '-'}
              onClick={handleCheckOut}
              className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${
                !myTodayRecord || myTodayRecord.checkOut !== '-'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-105'
              }`}
            >
              {myTodayRecord && myTodayRecord.checkOut !== '-' ? `Out at ${myTodayRecord.checkOut}` : 'Check Out'}
            </button>
          </div>
          {myTodayRecord && myTodayRecord.status === 'Late' && (
             <p className="mt-4 text-orange-500 font-medium text-sm flex items-center justify-center gap-2">
               <AlertCircle size={16} /> You were marked Late today.
             </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Attendance Logs</h3>
          <button className="text-blue-600 text-sm hover:underline">Download Report</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              {isAdmin && <th className="px-6 py-3 font-medium">Employee</th>}
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Clock In</th>
              <th className="px-6 py-3 font-medium">Clock Out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAttendance.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{record.date}</td>
                {isAdmin && (
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {users.find(u => u.id === record.userId)?.name}
                  </td>
                )}
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    record.status === 'Present' ? 'bg-green-100 text-green-700' :
                    record.status === 'Late' ? 'bg-orange-100 text-orange-700' :
                    record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">{record.checkIn}</td>
                <td className="px-6 py-4 font-mono text-sm">{record.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * VIEW: Leave & Time-off
 */
const LeaveView = ({ user, leaves, setLeaves, users, addToast }) => {
  const isAdmin = user.role === 'Admin';
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) return alert('Please select dates');
    
    const newLeave = {
      id: Date.now(),
      userId: user.id,
      ...formData,
      status: 'Pending'
    };
    
    setLeaves([...leaves, newLeave]);
    setShowModal(false);
    setFormData({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
    addToast('Leave request submitted', 'success');
  };

  const handleAction = (id, status) => {
    const updated = leaves.map(l => l.id === id ? { ...l, status } : l);
    setLeaves(updated);
    addToast(`Request marked as ${status}`, status === 'Approved' ? 'success' : 'info');
  };

  const filteredLeaves = isAdmin ? leaves : leaves.filter(l => l.userId === user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        {!isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Apply for Leave
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredLeaves.map(leave => (
          <div key={leave.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                 <div className={`p-2 rounded-lg ${leave.type === 'Sick Leave' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                   <FileText size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800">{leave.type}</h3>
                    <p className="text-xs text-gray-500">{isAdmin ? users.find(u => u.id === leave.userId)?.name : 'Applied on ' + new Date().toLocaleDateString()}</p>
                 </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {leave.status}
              </span>
            </div>
            
            <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
               <div className="flex justify-between mb-1">
                 <span>From:</span> <span className="font-semibold">{leave.startDate}</span>
               </div>
               <div className="flex justify-between">
                 <span>To:</span> <span className="font-semibold">{leave.endDate}</span>
               </div>
               <div className="mt-2 pt-2 border-t border-gray-200 italic text-xs">
                 "{leave.reason}"
               </div>
            </div>

            {isAdmin && leave.status === 'Pending' && (
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleAction(leave.id, 'Approved')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-semibold">Approve</button>
                <button onClick={() => handleAction(leave.id, 'Rejected')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded text-sm font-semibold">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">New Leave Request</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select 
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Sick Leave</option>
                  <option>Paid Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" required 
                    value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" required
                     value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24" placeholder="Brief description..."
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * VIEW: Payroll
 */
const PayrollView = ({ user, users, setUsers, addToast }) => {
  const isAdmin = user.role === 'Admin';
  const targetUser = user; 
  
  // State for Admin Editing
  const [editingId, setEditingId] = useState(null);
  const [newSalary, setNewSalary] = useState('');

  const handleEditClick = (u) => {
    setEditingId(u.id);
    setNewSalary(u.salary);
  };

  const handleSaveSalary = () => {
    const updatedUsers = users.map(u => u.id === editingId ? { ...u, salary: parseInt(newSalary) } : u);
    setUsers(updatedUsers);
    setEditingId(null);
    addToast('Salary structure updated!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
        <button className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">Download Slip</button>
      </div>

      {!isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Salary</p>
                <h2 className="text-2xl font-bold text-gray-900">${targetUser.salary.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ yr</span></h2>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">Next Payout</p>
              <p className="text-sm text-gray-500">Nov 30, 2023</p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-bold text-gray-800 mb-4">Salary Breakdown (Monthly)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Basic Pay</span>
                <span className="font-medium">${(targetUser.salary / 12 * 0.6).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">HRA (House Rent Allowance)</span>
                <span className="font-medium">${(targetUser.salary / 12 * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Special Allowances</span>
                <span className="font-medium">${(targetUser.salary / 12 * 0.2).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 my-2 pt-2"></div>
              <div className="flex justify-between text-sm text-red-500">
                <span>Tax Deductions (Est.)</span>
                <span>-${(targetUser.salary / 12 * 0.1).toFixed(2)}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mt-4">
                <span className="font-bold text-gray-900">Net Payable</span>
                <span className="font-bold text-green-600 text-lg">${(targetUser.salary / 12 * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Employee Salary Structures</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Annual CTC</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-500">{u.role}</td>
                    <td className="px-6 py-4 font-mono">
                      {editingId === u.id ? (
                        <input 
                          type="number" 
                          value={newSalary} 
                          onChange={(e) => setNewSalary(e.target.value)}
                          className="w-32 border border-blue-300 rounded px-2 py-1 outline-none"
                        />
                      ) : (
                        `$${u.salary.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === u.id ? (
                        <div className="flex gap-2">
                           <button onClick={handleSaveSalary} className="text-green-600 font-bold hover:underline">Save</button>
                           <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditClick(u)} className="text-blue-600 hover:underline">Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * VIEW: Profile
 */
const ProfileView = ({ user, setUser, addToast }) => {
  const isAdmin = user.role === 'Admin';
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...user });

  const handleSave = () => {
    setUser(tempData);
    setEditMode(false);
    addToast('Profile updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         {/* Cover Photo */}
         <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
         
         <div className="px-8 pb-8">
           <div className="relative flex justify-between items-end -mt-12 mb-6">
             <div className="bg-white p-1 rounded-full">
               <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md">
                 {user.avatar}
               </div>
             </div>
             {isAdmin && !editMode && (
               <button 
                 onClick={() => setEditMode(true)}
                 className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2"
               >
                 <Settings size={16} /> Edit Profile
               </button>
             )}
             {!isAdmin && (
                <button 
                 onClick={() => setEditMode(!editMode)}
                 className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 flex items-center gap-2"
               >
                 <Settings size={16} /> {editMode ? 'Cancel' : 'Edit Contact Info'}
               </button>
             )}
           </div>

           <div>
             <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
             <p className="text-gray-500">{user.role} • {user.department}</p>
           </div>

           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Contact Information</h3>
               
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                 <div className="text-gray-800 bg-gray-50 px-3 py-2 rounded border border-gray-100">{user.email}</div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
                 {editMode ? (
                   <input 
                     type="text" 
                     value={tempData.phone} 
                     onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                     className="w-full border border-blue-300 bg-blue-50 rounded px-3 py-2 outline-none"
                   />
                 ) : (
                   <div className="text-gray-800">{user.phone}</div>
                 )}
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
                  {editMode ? (
                   <input 
                     type="text" 
                     value={tempData.address} 
                     onChange={(e) => setTempData({...tempData, address: e.target.value})}
                     className="w-full border border-blue-300 bg-blue-50 rounded px-3 py-2 outline-none"
                   />
                 ) : (
                   <div className="text-gray-800">{user.address}</div>
                 )}
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Job Details</h3>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Department</label>
                    <div className="text-gray-800">{user.department}</div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Joining Date</label>
                    <div className="text-gray-800">Jan 12, 2022</div>
                 </div>
               </div>
                
               {editMode && (
                 <div className="mt-6 pt-4 border-t border-gray-100">
                   <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg">Save Changes</button>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
}

/**
 * VIEW: Employee List (Admin Only)
 */
const EmployeeListView = ({ users }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Employees</h1>
        <div className="relative">
          <input type="text" placeholder="Search employees..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.filter(u => u.role !== 'Admin').map(u => (
        <div key={u.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 flex items-center justify-center text-white text-xl font-bold">
            {u.avatar}
          </div>
          <h3 className="font-bold text-lg text-gray-900">{u.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{u.role} • {u.department}</p>
          <div className="w-full border-t border-gray-100 pt-4 flex justify-between text-sm">
             <span className="text-gray-500">Salary</span>
             <span className="font-semibold text-gray-900">${u.salary.toLocaleString()}</span>
          </div>
          <button className="mt-4 w-full bg-gray-50 text-gray-700 py-2 rounded font-medium hover:bg-gray-100">View Details</button>
        </div>
      ))}
    </div>
  </div>
);