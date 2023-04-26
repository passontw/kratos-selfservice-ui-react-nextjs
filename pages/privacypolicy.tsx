import { NextPage } from 'next';
import PrivacyPolicyLayout from '../components/Layout/PolicyLayout';
import PrivacyPolicyContent from '../components/PrivacyPolicyContent';


const PrivacyPolicy: NextPage = () => {
  return (
    <PrivacyPolicyLayout title="Privacy Policy And Your Privacy Rights">
        <PrivacyPolicyContent />
    </PrivacyPolicyLayout>
  )
}


export default PrivacyPolicy