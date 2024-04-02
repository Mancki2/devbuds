import fetchEducation from '@/database/educations/fetchEducation'
import fetchExperiences from '@/database/experiences/fetchExperiences'
import fetchProfileByID from '@/database/profiles/fetchProfileByID'
import getProjects from '@/database/projects/getProjects'
import { useAppSelector } from '@/store/hooks'
import { IEducationTableTypes, IExperienceTableTypes, IProfileTableTypes, IProjectTableTypes } from '@/types'
import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import EducationCard from '../EducationCard'
import ExperienceCard from '../ExperienceCard'
import PortfolioCard from '../PortfolioCard'
import ProfileInfoCard from '../ProfileInfoCard'
import ProfileProjectCard from '../ProfileProjectCard'

interface formattedExperience {
  companyLogo: string
  companyTitle: string
  companyName: string
  startDate: string
  endDate: string
  description: string | null
}

interface formattedEducation {
  schoolLogo: string
  schoolName: string
  schoolMajor: string
  startDate: string
  endDate: string
}

interface formattedProject {
  projectName: string
  hackathonName: string
  projectDate: string
  description: string
}

const ProfileTab = () => {
  const user = useAppSelector(state => state.auth)
  const [profileData, setProfileData] = useState<IProfileTableTypes>()
  const [experiences, setExperiences] = useState<IExperienceTableTypes[]>([])
  const [educations, setEducations] = useState<IEducationTableTypes[]>([])
  const [projects, setProjects] = useState<IProjectTableTypes[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    async function getData() {
      // make user user id is not null
      if (typeof user.profile_id === 'number') {
        // fetch user profile data using id
        const userData = await fetchProfileByID(user.profile_id)
        // fetch user experience data using profile_id
        const experienceData = await fetchExperiences(user.profile_id)
        // fetch user education data using profile_id
        const educationData = await fetchEducation(user.profile_id)
        // fetch user projects data using profile_id
        const projectsData = await getProjects(user.profile_id)
        setIsLoading(false)
        // if statements to make sure data is not null type

        if (userData) setProfileData(userData)

        if (experienceData) setExperiences(experienceData)

        if (educationData) setEducations(educationData)

        if (projectsData) setProjects(projectsData)
      }
    }
    getData()
  }, [])

  if (isLoading) return <div>Loading...</div>
  const createProfileInfoCard = () => {
    if (profileData) {
      return (
        <div>
          <ProfileInfoCard
            userFirstName={profileData.first_name}
            userLastName={profileData.last_name}
            userSchool={profileData.school}
            userLocation={profileData.location}
            userEmail={profileData.email}
            userMajor={profileData.major}
          />
        </div>
      )
    }
  }

  const createAvatar = () => {
    if (profileData) {
      return (
        <div>
          <Avatar firstName={profileData.first_name} lastName={profileData.last_name} />
        </div>
      )
    }
  }

  const createExperienceCard = () => {
    if (experiences) {
      const formattedExperiences: formattedExperience[] = []
      // format experience data to a format acceptable for Experience Card
      experiences.map(experience =>
        formattedExperiences.push({
          companyLogo: experience.company,
          companyTitle: experience.title,
          companyName: experience.company,
          startDate: experience.start_date,
          endDate: experience.end_date,
          description: experience.description,
        })
      )

      // fix type of description It can't be NULL
      return (
        <div>
          <ExperienceCard experiences={formattedExperiences} />
        </div>
      )
    }
  }

  const createEducationCard = () => {
    if (educations) {
      const formattedEducation: formattedEducation[] = []
      // Format education to be acceptable for EducationCard
      educations.map(education =>
        formattedEducation.push({
          schoolLogo: education.school,
          schoolName: education.school,
          schoolMajor: education.major,
          startDate: education.start_date,
          endDate: education.end_date,
        })
      )
      return (
        <div>
          <EducationCard educations={formattedEducation} />
        </div>
      )
    }
  }

  const createProjectCard = () => {
    if (projects) {
      const formattedProjects: formattedProject[] = []
      // Format projects to be acceptable by Project Card
      projects.map(project =>
        formattedProjects.push({
          projectName: project.project_name,
          hackathonName: project.position_title,
          projectDate: project.start_date + project.end_date,
          description: project.description,
        })
      )
      // Fix type of description, it can't be NULL ?
      return (
        <div>
          <ProfileProjectCard projects={formattedProjects} />
        </div>
      )
    }
  }

  /**
   * Navigate to localhost:5167/dashboard to view this file
   * Order of the components if the following
   * 1. Avatar
   * 2. ProfileInfoCard
   * 3. ExperienceCard
   * 4. EducationCard
   * 5. ProfileProjectCard
   * 6. PortfolioCard
   * Use the fetchProfileByID function to get the user's profile
   * I made it so that in this branch the user.id is default to 1 which is
   * a valid user id in the database
   * Do not worry about the Skills Card, it is still in development
   * If you have any questions, please ask!
   */
  return (
    <div className='relative'>
      <div className='bg-[#ededed] rounded-3xl border-1'>
        <div className='w-full px-14 py-7 ml-4'>
          <div className='flex items-center space-x-8'>
            {createAvatar()}
            {createProfileInfoCard()}
          </div>
          <div className='py-5 mr-10'>
            <div className='py-5'>{createExperienceCard()}</div>

            <div className='py-5'>{createEducationCard()}</div>

            <div className='py-5'>{createProjectCard()}</div>
            <div className='py-5'>
              <PortfolioCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTab