import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { usePuterStore } from '~/lib/putter'

export const meta = () =>([
    {title: 'Resumind | Review' },
    {name: 'description', content: 'Detailed overview of your resume '}
  
  ])



const resume = () => {
  const { auth, isLoading, fs, kv} =usePuterStore();
  const {id} = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback , setFeedback] = useState('');
  const navigate = useNavigate();


  useEffect(()=>{
    if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);

  },[isLoading])

  useEffect(()=>{
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if(!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if(!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob],{ type : 'application/pdf'});
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if(!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
      console.log({resumeUrl,imageUrl, feedback:data.feedback})


    }

    loadResume();

  },[id]);



  return (
    <main>
      <nav className='resume-nav'>
        <Link to='/' className='back-button'>
          <img src='/icons/back.svg' alt="logo"/>
          <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
        </Link>
      </nav>
      <div className='flex flex-row w-full max-lg:flex-col-reverse'>
        <section className='feedback-section'>
          {imageUrl && resumeUrl &&(
            <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit '>
              <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                <img 
                  src={imageUrl}
                  className='w-full h-full object-contain rounded-2xl'
                  title='resume'
                  />
              </a>
           </div>
          )}
          

        </section>

        <section className='feedback-section'>
          <h2 className='text-4xl !text-black font-bold'>
            Resume Review
          </h2>
          {feedback ? (
            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
              Summary ATS Details
            </div>

          ):(
            <img src='/images/resume-scan-2.gif' className='w-full'/>

          )}
        </section>

      </div>
    </main>
  )
}

export default resume