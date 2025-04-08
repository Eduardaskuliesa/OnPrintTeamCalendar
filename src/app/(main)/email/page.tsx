
import EmailTemplateList from "./EmailTemplateList";
import CreateNewButtont from "./CreateNewButtont";

const EmailTemplatesPage = async () => {
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <CreateNewButtont></CreateNewButtont>
      </div>


      <EmailTemplateList />

    </div>
  );
};

export default EmailTemplatesPage;
