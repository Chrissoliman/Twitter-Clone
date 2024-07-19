import {useMutation, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {toast} from 'react-hot-toast'

const useFollow = () => {
    const queryClient = useQueryClient()

    const {mutate: follow, isPending, error} = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await axios.post(`/api/users/follow/${userId}`)

                return res.data
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({queryKey: ['suggestedUsers']}),
                queryClient.invalidateQueries({queryKey: ['authUser']}),
            ])
        },
        onError: () => {
            toast.error(error.response.data.error)
        }
    })


    return {follow, isPending}

}

export default useFollow