import { useEffect, useState, useContext } from "react"

import { UserContext } from "./AuthenticatedWrapper"

import { getDatabase, ref, set, onValue } from "firebase/database"

import Loader from "../common/Loader"

import Styles from "../../styles/Characters.module.sass"
