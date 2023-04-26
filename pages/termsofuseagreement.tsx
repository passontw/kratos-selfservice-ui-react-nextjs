import { NextPage } from 'next';
import PrivacyPolicyLayout from '../components/Layout/PolicyLayout';
import TermsOfUseAgreementContent from '../components/TermsOfUseAgreementContent';


const TermsOfUseAgreement: NextPage = () => {
  return (
    <PrivacyPolicyLayout title="Terms Of Use Agreement">
        <TermsOfUseAgreementContent />
    </PrivacyPolicyLayout>
  )
}


export default TermsOfUseAgreement