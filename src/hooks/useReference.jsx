import { useState } from 'react'
import { getDatabase, ref } from "firebase/database"

export default function useReference(path) {
    const [ reference ] = useState(ref(getDatabase(), path))
    return reference
}