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
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { setToastMessage } = useToastContext();

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{7,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""));
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-muted-foreground text-center">
          Manage your contacts and send personalized messages to everyone at
          once
        </p>

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
            <CardTitle>Contact List ({contacts.length})</CardTitle>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContact(contact.id)}
                            className="text-destructive hover:text-destructive"
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

        {contacts.length > 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  🎉 Great! You have {contacts.length} contact
                  {contacts.length !== 1 ? "s" : ""} ready.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default HomePage;
