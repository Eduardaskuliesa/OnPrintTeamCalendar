"use client";
import { Button } from "@/components/ui/button";
import { Mail, SendHorizonal } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendTestEmail } from "@/app/lib/actions/emails/sendTestEmail";
import EmailTemplate from "@/app/(main)/email/EmailTemplate";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import { render } from "@react-email/render";

const SendTestButton = () => {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    templateType: "regular" as "regular" | "promotional",
  });

  const { emailComponents } = useEmailBuilderStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSetEmailTest = async () => {
    try {
      setIsSending(true);

      const template = <EmailTemplate templateType={formData.templateType} emailComponents={emailComponents} />;

      const html = await render(template);
  
      await sendTestEmail({
        to: formData.to,
        subject: formData.subject,
        htmlBody: html,
      });

      toast.success("Test email sent successfully!");
      setOpenDialog(false);

      setFormData({
        to: "",
        subject: "",
        body: "",
        templateType: "regular"
      });
    } catch (error) {
      console.error("Failed to send test email:", error);
      toast.error("Failed to send test email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpenDialog(true);
        }}
        variant="default2"
        className="text-base bg-dcoffe text-db hover:bg-opacity-90 flex items-center gap-2"
      >
        <SendHorizonal size={18} />
        Send Test Email
      </Button>

      <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">Recipient Email</Label>
              <Input
                id="to"
                name="to"
                placeholder="recipient@example.com"
                value={formData.to}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Test Email Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>


            <div className="flex gap-2 ">
              <div>
                <Button
                  variant={'outline'}
                  className={formData.templateType === "regular" ? "bg-db text-white" : "bg-gray-200 text-black"}
                  onClick={() => setFormData((prev) => ({ ...prev, templateType: "regular" }))}
                >
                  <Mail className='h-5 w-5'></Mail>
                  <span>Regular</span>
                </Button>
              </div>
              <div>
                <Button
                  variant={'outline'}
                  className={formData.templateType === "promotional" ? "bg-db text-white" : "bg-gray-200 text-black"}
                  onClick={() => setFormData((prev) => ({ ...prev, templateType: "promotional" }))}
                >
                  <Mail className='h-5 w-5'></Mail>
                  <span>Promotional</span>
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSetEmailTest}
              disabled={isSending || !formData.to || !formData.subject}
            >
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendTestButton;
