import React, { useState } from 'react';
import { Mail, Share2 } from 'lucide-react';

const InvitePage = () => {
  const [inviteAlert, setInviteAlert] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendEmail = async (emailAddress) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const handleInvite = async (method) => {
    if (method === 'email') {
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      
      setEmailError('');
      const sent = await sendEmail(email);
      
      if (sent) {
        setInviteAlert(true);
        setEmail('');
        setTimeout(() => setInviteAlert(false), 3000);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://gamenest.com/join/123');
    setInviteAlert(true);
    setTimeout(() => setInviteAlert(false), 3000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Invite Friends</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-blue-900">Email Invite</h2>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter friend's email"
            className={`w-full p-2 border rounded-md mb-4 ${emailError ? 'border-red-500' : ''}`}
          />
          {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}
          <button
            onClick={() => handleInvite('email')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Send Invite
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Share2 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-blue-900">Share Link</h2>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value="https://gamenest.com/join/123"
              readOnly
              className="w-full p-2 border rounded-md bg-gray-50"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {inviteAlert && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {email ? 'Invitation sent successfully! +10 points added' : 'Link copied successfully!'}
        </div>
      )}
    </div>
  );
};

export default InvitePage;