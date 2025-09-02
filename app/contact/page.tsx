"use client";

import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Eye, MessageSquare, Plus, Send, Trash2 } from "lucide-react";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  status?: "pending" | "sending" | "sent" | "failed";
}

function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Abhay Pratap Singh", phone: "916387661992" },
    { id: "2", name: "Cool", phone: "919369774914" },
  ]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { setToastMessage } = useToastContext();

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{7,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
  };

  const addContact = () => {
    if (!name.trim()) {
      setToastMessage("Please enter contact name.");
      return;
    }

    if (!phone.trim()) {
      setToastMessage("Please enter a phone number");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setToastMessage("Please enter a valid phone number");
      return;
    }

    if (contacts.some((contact) => contact.phone === phone.trim())) {
      setToastMessage("A contact with this phone number already exists");
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
    };

    setContacts([...contacts, newContact]);
    setName("");
    setPhone("");

    setToastMessage(`${newContact.name} has been added to your contact list`);
  };

  const deleteContact = (id: string) => {
    const contactToDelete = contacts.find((c) => c.id === id);
    setContacts(contacts.filter((contact) => contact.id !== id));

    if (contactToDelete) {
      setToastMessage(
        `${contactToDelete.name} has been removed from your contact list`
      );
    }
  };

  const getPreviewMessage = (contactName: string) => {
    return message.replace(/\{name\}/g, contactName);
  };

  const getCharacterCount = () => {
    return message.length;
  };

  const isMessageValid = () => {
    return message.trim().length > 0 && message.length <= 4096;
  };

  const sendToAll = async () => {
    if (!isMessageValid() || contacts.length === 0) {
      setToastMessage("Please ensure you have contacts and a valid message");
      return;
    }

    setIsSending(true);

    setContacts((prev) =>
      prev.map((contact) => ({ ...contact, status: "pending" as const }))
    );

    const successCount = 0;
    const failureCount = 0;

    // for (const contact of contacts) {
    //   try {
    //     setContacts((prev) =>
    //       prev.map((c) =>
    //         c.id === contact.id ? { ...c, status: "sending" as const } : c
    //       )
    //     );

    //     const personalizedMessage = getPreviewMessage(contact.name);

    //     const result = await sendWhatsAppMessage(
    //       contact.phone,
    //       personalizedMessage
    //     );

    //     if (result.success) {
    //       setContacts((prev) =>
    //         prev.map((c) =>
    //           c.id === contact.id ? { ...c, status: "sent" as const } : c
    //         )
    //       );
    //       successCount++;
    //     }
    //     if (result.error) {
    //       setToastMessage(result.error);
    //     }
    //   } catch (error) {
    //     setContacts((prev) =>
    //       prev.map((c) =>
    //         c.id === contact.id ? { ...c, status: "failed" as const } : c
    //       )
    //     );
    //     failureCount++;
    //   }

    //   if (contact !== contacts[contacts.length - 1]) {
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //   }
    // }

    setIsSending(false);

    setToastMessage(
      `Broadcast complete! ${successCount} sent successfully, ${failureCount} failed.`
    );
  };

  const getStatusIcon = (status?: Contact["status"]) => {
    switch (status) {
      case "sending":
        return (
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        );
      case "sent":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "failed":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">WhatsApp Message Broadcaster</h1>
          <p className="text-muted-foreground">
            Manage your contacts and send personalized messages to everyone at
            once
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Contact
            </CardTitle>
            <CardDescription>
              Enter contact details to add them to your broadcast list
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter contact name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addContact()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addContact()}
                />
              </div>
            </div>
            <Button onClick={addContact} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Compose Message
            </CardTitle>
            <CardDescription>
              Write your message with {"{name}"} to personalize it for each
              contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Hi {name}, this is a personalized message for you!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Use {"{name}"} to insert contact names</span>
                <span
                  className={
                    getCharacterCount() > 4096 ? "text-destructive" : ""
                  }
                >
                  {getCharacterCount()}/4096 characters
                </span>
              </div>
            </div>

            {message.trim() && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>

                {contacts.length > 0 && isMessageValid() && (
                  <Button
                    onClick={sendToAll}
                    disabled={isSending}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSending
                      ? `Sending... (${
                          contacts.filter((c) => c.status === "sent").length
                        }/${contacts.length})`
                      : `Send to All (${contacts.length})`}
                  </Button>
                )}
              </div>
            )}

            {showPreview && message.trim() && contacts.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Message Preview</CardTitle>
                  <CardDescription className="text-xs">
                    How your message will look for each contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contacts.slice(0, 3).map((contact) => (
                    <div key={contact.id} className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        To: {contact.name} ({contact.phone})
                      </div>
                      <div className="p-3 bg-background rounded-md border text-sm">
                        {getPreviewMessage(contact.name)}
                      </div>
                    </div>
                  ))}
                  {contacts.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      ... and {contacts.length - 3} more contacts
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact List </CardTitle>
            <CardDescription>
              {contacts.length === 0
                ? "No contacts added yet. Add your first contact above."
                : "Manage your broadcast contact list"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your contact list is empty</p>
                <p className="text-sm">
                  Add contacts above to start broadcasting messages
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell className="font-mono">
                          {contact.phone}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(contact.status)}
                            <span className="text-xs capitalize">
                              {contact.status || "ready"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContact(contact.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={isSending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
