import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-rose-200 rounded-2xl p-6 shadow-lg text-center space-y-4">
            <div className="size-14 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="size-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">
                Terjadi Kendala pada Halaman
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Aplikasi mendeteksi error pada antarmuka. Silakan muat ulang halaman atau periksa izin akses webcam peramban Anda.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-left font-mono text-[11px] text-rose-800 break-all overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <Button
                onClick={this.handleReload}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-9 px-4"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                Muat Ulang Halaman
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
