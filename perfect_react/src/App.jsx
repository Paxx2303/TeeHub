import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import { ProductDetail } from './pages/Products/index.detail';
import AITryOn from './pages/AITryOn';
import Design from './pages/Design';
import './styles/globals.css';
import './styles/variables.css';
import AuthPage from './pages/Login/AuthPage';
// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee',
          border: '2px solid #f00',
          margin: '20px',
          borderRadius: '8px'
        }}>
          <h1 style={{ color: '#d00' }}>🚨 Có lỗi xảy ra!</h1>
          <h2>Chi tiết lỗi:</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Click để xem chi tiết</summary>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>Stack trace:</strong></p>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <div className="App">

            <ErrorBoundary>
              <Header />
            </ErrorBoundary>
            <main>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/ai-try-on" element={<AITryOn />} />
                  <Route path="/design" element={<Design />} />
                  <Route path="/login" element={<AuthPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                },
              }}
            />
          </div>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;