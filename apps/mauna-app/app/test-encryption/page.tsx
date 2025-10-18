'use client'

import { useState } from 'react'
import { AuthService } from '@/lib/auth-service'
import { useEncryption } from '@/lib/encryption-context'
import { Button } from '@/components/ui/button'

export default function TestEncryptionPage() {
  const { encryptionKey, userData, setEncryptionKey, setUserData, user, isEncryptionReady } = useEncryption()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Test Registration
  const handleRegister = async () => {
    setLoading(true)
    setMessage('')
    try {
      const result = await AuthService.signUpWithEncryption(email, password, {
        journal_entries: [{
          id: '1',
          title: 'Test Entry',
          content: 'This is encrypted!',
          created_at: new Date().toISOString()
        }]
      })

      if (result.error) {
        setMessage(`❌ Error: ${result.error}`)
      } else {
        setMessage('✅ Registration successful! Check your email to verify.')
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test Login
  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    try {
      const result = await AuthService.signInWithDecryption(email, password)

      if (result.error) {
        setMessage(`❌ Error: ${result.error}`)
      } else {
        setEncryptionKey(result.encryptionKey!)
        setUserData(result.userData!)
        setMessage('✅ Login successful! Data decrypted.')
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test Save
  const handleSaveData = async () => {
    if (!user || !encryptionKey) {
      setMessage('❌ Must be logged in')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const updatedData = {
        ...userData,
        journal_entries: [
          ...(userData?.journal_entries || []),
          {
            id: crypto.randomUUID(),
            title: 'New Entry',
            content: 'Added after login!',
            created_at: new Date().toISOString()
          }
        ]
      }

      const result = await AuthService.saveEncryptedUserData(
        user.id,
        updatedData,
        encryptionKey
      )

      if (result.error) {
        setMessage(`❌ Error: ${result.error}`)
      } else {
        setUserData(updatedData)
        setMessage('✅ Data saved encrypted!')
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test Logout
  const handleLogout = async () => {
    await AuthService.signOut()
    setMessage('✅ Logged out')
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">🔐 Encryption Test Page</h1>

        {/* Status */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2">Status:</h2>
          <p>User: {user ? user.email : 'Not logged in'}</p>
          <p>Encryption Ready: {isEncryptionReady ? '✅ Yes' : '❌ No'}</p>
          <p>Has Data: {userData ? '✅ Yes' : '❌ No'}</p>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="password123"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button onClick={handleRegister} disabled={loading || !email || !password}>
            1. Register
          </Button>
          <Button onClick={handleLogin} disabled={loading || !email || !password}>
            2. Login
          </Button>
          <Button onClick={handleSaveData} disabled={loading || !isEncryptionReady}>
            3. Save Data
          </Button>
          <Button onClick={handleLogout} disabled={loading || !user}>
            4. Logout
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Decrypted Data Display */}
        {userData && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Decrypted User Data:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter an email and password</li>
            <li>Click "1. Register" to create account with encrypted data</li>
            <li>Check Supabase: encrypted_user_data table should have encrypted blob</li>
            <li>Click "2. Login" to decrypt the data</li>
            <li>See decrypted data appear below</li>
            <li>Click "3. Save Data" to add more encrypted data</li>
            <li>Refresh page - encryption key lost (security feature)</li>
            <li>Login again to re-decrypt</li>
          </ol>
        </div>

        {/* Verification */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold mb-2">✅ What This Proves:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Data encrypted client-side before storage</li>
            <li>You (admin) cannot read encrypted_data in Supabase</li>
            <li>Only user with password can decrypt</li>
            <li>Encryption key stored in memory only (lost on refresh)</li>
            <li>Zero-knowledge encryption working!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
