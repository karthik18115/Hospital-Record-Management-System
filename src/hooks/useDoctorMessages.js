import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import {
  getDoctorMessageContacts, // To be created in doctorService
  getMessagesForContact,    // To be created in doctorService
  postDoctorMessage         // To be created/updated in doctorService (current sendMessage)
} from '../services/doctorService';
import { toast } from 'react-toastify';

function useDoctorMessages() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [messagesByContactId, setMessagesByContactId] = useState({}); // Stores messages keyed by contactId
  
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial contacts
  useEffect(() => {
    if (user) {
      setLoadingContacts(true);
      getDoctorMessageContacts()
        .then(data => {
          setContacts(data || []);
          setError(null);
        })
        .catch(err => {
          console.error("Failed to fetch contacts:", err);
          toast.error("Failed to load message contacts.");
          setError(err);
        })
        .finally(() => setLoadingContacts(false));
    }
  }, [user]);

  const fetchMessages = useCallback(async (contactId) => {
    if (!contactId) return;
    setLoadingMessages(true);
    try {
      const contactMessages = await getMessagesForContact(contactId);
      setMessagesByContactId(prev => ({
        ...prev,
        [contactId]: contactMessages || []
      }));
      setError(null);
    } catch (err) {
      console.error(`Failed to fetch messages for contact ${contactId}:`, err);
      toast.error(`Failed to load messages for ${contacts.find(c=>c.id === contactId)?.name || 'contact'}.`);
      setError(err);
      setMessagesByContactId(prev => ({
        ...prev,
        [contactId]: prev[contactId] || [] // Keep existing messages or empty array on error
      }));
    } finally {
      setLoadingMessages(false);
    }
  }, [contacts]); // Added contacts dependency

  const selectContact = useCallback((contactId) => {
    setSelectedContactId(contactId);
    if (contactId && !messagesByContactId[contactId]) { // Fetch only if not already fetched or force refresh if needed
        fetchMessages(contactId);
    }
  }, [messagesByContactId, fetchMessages]);

  const sendMessageToSelectedContact = useCallback(async (content) => {
    if (!selectedContactId || !content.trim() || !user) return;

    const tempMessageId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempMessageId,
      senderId: user.uuid, // Assuming user.uuid is the ID
      senderName: user.fullName || 'Me',
      recipientId: selectedContactId, // Or however your backend expects it
      contactId: selectedContactId, // For UI grouping
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: 'sending' // For UI indication
    };

    // Optimistic update
    setMessagesByContactId(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));

    setSendingMessage(true);
    try {
      const sentMessageFromServer = await postDoctorMessage(selectedContactId, { content: content.trim() });
      // Replace temp message with server message
      setMessagesByContactId(prev => ({
        ...prev,
        [selectedContactId]: (prev[selectedContactId] || []).map(msg => 
          msg.id === tempMessageId ? { ...sentMessageFromServer, senderName: user.fullName || 'Me' } : msg
        )
      }));
      setError(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message.");
      setError(err);
      // Revert or mark as failed
      setMessagesByContactId(prev => ({
        ...prev,
        [selectedContactId]: (prev[selectedContactId] || []).map(msg => 
          msg.id === tempMessageId ? { ...msg, status: 'failed' } : msg
        )
      }));
    } finally {
      setSendingMessage(false);
    }
  }, [selectedContactId, user]);

  const currentMessages = messagesByContactId[selectedContactId] || [];

  return {
    contacts,
    selectedContactId,
    selectContact,
    currentMessages, // Messages for the currently selected contact
    setMessages: setMessagesByContactId, // Provide a way to update messages externally if needed (like page did)
    loadingContacts,
    loadingMessages: loadingMessages && !!selectedContactId, // Only true if a contact is selected and messages are loading
    sendingMessage,
    sendMessage: sendMessageToSelectedContact,
    error,
    fetchMessagesForContact: fetchMessages // Exposing fetchMessages directly if needed by page
  };
}

export default useDoctorMessages; 