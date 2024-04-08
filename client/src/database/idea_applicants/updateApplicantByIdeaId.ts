import supabase from '@/lib/supabaseClient'

interface IIdeaApplicants {
  idea_id: number
  profile_id: number
  application_role: 'Frontend' | 'Backend' | 'UI/UX' | 'Full-Stack'
  is_accepted: boolean
}

const updateIdeaApplicants = async (newApplicantUpdate: IIdeaApplicants) => {
  const { data: ideas, error } = await supabase
    .from('idea_applicants')
    .update({
      is_accepted: newApplicantUpdate.is_accepted,
    })
    .eq('idea_id', newApplicantUpdate.idea_id)
    .eq('profile_id', newApplicantUpdate.profile_id)
    .select('*')

  if (ideas) {
    return ideas
  } else {
    console.error(error)
    return null
  }
}

export default updateIdeaApplicants
