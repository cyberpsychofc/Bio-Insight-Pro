import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
export default function About() {
    return (
        <>
            <Helmet>
                <title>About | BioInsightPro</title>
            </Helmet>
            <div className='mt-10 p-10'></div>
            <div>
                <Footer />
            </div>
        </>
    )
}