import AccountClient from "./account-client";
export const metadata = { title: "Sign in | DocuBridge" };
export default function AccountPage() {
  return <main className="wrap toolPage"><a className="backLink" href="/">← DocuBridge</a><div className="eyebrow">CUSTOMER WORKSPACE</div><h1 className="pageTitle">Your documents, together.</h1><p className="lead">Create an account or sign in to access your DocuBridge workspace. Authentication activates once the project’s Supabase environment is configured.</p><AccountClient /></main>;
}
