import React, { useState } from 'react'
import { useEffect } from 'react'
import './SourceMapDemo.css'

function SourceMapDemo({ onBack }) {
  useEffect(() => {
    window.awsRum?.recordEvent('sourcemap_demo_rendered', { timestamp: Date.now() })
  }, [])
  // Removed unused handleDemoAction
  // const handleDemoAction = (action) => {
  //   window.awsRum?.recordEvent('sourcemap_demo_action', { action })
  //   // ...existing demo logic...
  // }
  const [, setErrorType] = useState(null)

  // Various error scenarios
  const throwReferenceError = () => {
    // This will throw: ReferenceError
    // eslint-disable-next-line no-undef
    undefinedVariable.someMethod()
  }

  const throwTypeError = () => {
    // This will throw: TypeError
    null.toString()
  }

  const throwRangeError = () => {
    // This will throw: RangeError
    const arr = []
    arr.length = -1
  }

  const throwCustomError = () => {
    throw new Error('Custom error thrown from SourceMapDemo component')
  }

  const throwAsyncError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    throw new Error('Async error after timeout')
  }

  const throwInEventHandler = () => {
    setTimeout(() => {
      throw new Error('Error in setTimeout callback')
    }, 100)
  }

  const throwInNestedFunction = () => {
    const level1 = () => {
      const level2 = () => {
        const level3 = () => {
          throw new Error('Error in deeply nested function')
        }
        level3()
      }
      level2()
    }
    level1()
  }

  const triggerError = (type) => {
    setErrorType(type)
    try {
      switch (type) {
        case 'reference':
          throwReferenceError()
          break
        case 'type':
          throwTypeError()
          break
        case 'range':
          throwRangeError()
          break
        case 'custom':
          throwCustomError()
          break
        case 'async':
          throwAsyncError()
          break
        case 'timeout':
          throwInEventHandler()
          break
        case 'nested':
          throwInNestedFunction()
          break
        default:
          break
      }
    } catch (error) {
      console.error('Caught error:', error)
      // Re-throw to see it in browser console with source maps
      throw error
    }
  }

  return (
    <div className="source-map-demo">
      <button className="back-button" onClick={onBack}>
        ← Back to all posts
      </button>

      <div className="demo-content">
        <h1>Source Map Demo</h1>
        <p className="demo-description">
          Click any button below to trigger an error. Check your browser&apos;s DevTools console to
          see the stack trace. With source maps enabled, you&apos;ll see the original source file
          locations.
        </p>

        <div className="error-buttons">
          <div className="error-card">
            <h3>ReferenceError</h3>
            <p>Access undefined variable</p>
            <button onClick={() => triggerError('reference')} className="error-button">
              Trigger Error
            </button>
          </div>

          <div className="error-card">
            <h3>TypeError</h3>
            <p>Call method on null</p>
            <button onClick={() => triggerError('type')} className="error-button">
              Trigger Error
            </button>
          </div>

          <div className="error-card">
            <h3>RangeError</h3>
            <p>Invalid array length</p>
            <button onClick={() => triggerError('range')} className="error-button">
              Trigger Error
            </button>
          </div>

          <div className="error-card">
            <h3>Custom Error</h3>
            <p>Throw custom message</p>
            <button onClick={() => triggerError('custom')} className="error-button">
              Trigger Error
            </button>
          </div>

          <div className="error-card">
            <h3>Async Error</h3>
            <p>Error in async function</p>
            <button onClick={() => triggerError('async')} className="error-button">
              Trigger Error
            </button>
          </div>

          <div className="error-card">
            <h3>Timeout Error</h3>
            <p>Error in setTimeout</p>
            <button onClick={() => triggerError('timeout')} className="error-button">
              Trigger Error
            </button>
          </div>

          <div className="error-card">
            <h3>Nested Error</h3>
            <p>Error in nested functions</p>
            <button onClick={() => triggerError('nested')} className="error-button">
              Trigger Error
            </button>
          </div>
        </div>

        <div className="instructions">
          <h2>How to Test Source Maps</h2>
          <ol>
            <li>
              <strong>Enable source maps</strong> in <code>vite.config.js</code>:
              <pre>build: {'{ sourcemap: true }'}</pre>
            </li>
            <li>
              <strong>Build and deploy</strong> your app
            </li>
            <li>
              <strong>Open DevTools</strong> in your browser (F12)
            </li>
            <li>
              <strong>Click any error button</strong> above
            </li>
            <li>
              <strong>Check the Console tab</strong> - you should see:
              <ul>
                <li>
                  Original file names (e.g., <code>SourceMapDemo.jsx</code>)
                </li>
                <li>Original line numbers</li>
                <li>Clickable links to source code</li>
              </ul>
            </li>
          </ol>

          <h3>Without Source Maps</h3>
          <p>You&apos;ll see minified file names like:</p>
          <pre>at index-ABC123.js:1:23456</pre>

          <h3>With Source Maps</h3>
          <p>You&apos;ll see original source locations like:</p>
          <pre>at throwReferenceError (SourceMapDemo.jsx:12:5)</pre>
        </div>
      </div>
    </div>
  )
}

export default SourceMapDemo
