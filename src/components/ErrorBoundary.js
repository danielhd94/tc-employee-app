import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Puedes agregar lógica de registro de errores aquí
        console.error('Error:', error);
    }

    render() {
        if (this.state.hasError) {
            return <div>Hubo un error en la aplicación.</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
