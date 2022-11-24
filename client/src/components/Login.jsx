import { useState, useContext } from "react"
import fetchLogin from "../utils/Login"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import { LoggedInContext } from "../App"
import {
	Flex,
	Heading,
	Input,
	Button,
	InputGroup,
	Stack,
	InputLeftElement,
	chakra,
	Box,
	Link,
	Avatar,
	FormControl,
	FormHelperText,
	InputRightElement,
	useToast,
} from "@chakra-ui/react"

import { FaUserAlt, FaLock } from "react-icons/fa"

const CFaUserAlt = chakra(FaUserAlt)
const CFaLock = chakra(FaLock)

export default function Login({ setIsLoggedIn }) {
	const toast = useToast()
	const [showPassword, setShowPassword] = useState(false)
	const navigate = useNavigate()
	const [formValue, setFormValue] = useState({})
	const { user, setUser } = useContext(UserContext)
	const [fields, setFields] = useState({
		username: "",
		password: "",
	})
	const handleShowClick = () => setShowPassword(!showPassword)
	const onType = (event) => {
		const { name, value } = event.target
		setFields({ ...fields, [name]: value })
	}
	const onSignIn = async (event) => {
		event.preventDefault()
		setFormValue(fields)
		const loggedInReponse = await fetchLogin(fields)
		if (loggedInReponse.user) {
			setIsLoggedIn(true)
			setUser(loggedInReponse.user)
			navigate("/")
		}
		toast({
			title: "Logged In.",
			description: "Welcome back to chess repertoire trainer",
			status: "success",
			duration: 9000,
			isClosable: true,
		})
	}

	const onNavigate = (event) => {
		event.preventDefault()
		navigate("/register")
	}

	return (
		<Flex flexDirection="column" width="100wh" height="100vh" justifyContent="center" alignItems="center">
			<Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
				<Avatar />
				<Heading>Welcome</Heading>
				<Box minW={{ base: "90%", md: "468px" }}>
					<form onSubmit={onSignIn}>
						<Stack spacing={4} p="1rem" boxShadow="md">
							<FormControl>
								<InputGroup>
									<InputLeftElement pointerEvents="none" children={<CFaUserAlt />} />
									<Input type="text" name="username" onChange={onType} value={fields.username} placeholder="username" />
								</InputGroup>
							</FormControl>
							<FormControl>
								<InputGroup>
									<InputLeftElement pointerEvents="none" children={<CFaLock />} />
									<Input
										type={showPassword ? "text" : "password"}
										name="password"
										onChange={onType}
										value={fields.password}
										placeholder="Password"
									/>
									<InputRightElement width="4.5rem">
										<Button h="1.75rem" size="sm" onClick={handleShowClick}>
											{showPassword ? "Hide" : "Show"}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormHelperText textAlign="right">
									<Link>forgot password?</Link>
								</FormHelperText>
							</FormControl>
							<Button borderRadius={0} type="submit" variant="solid" width="full">
								Login
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
			<Box>
				New to us? <Link onClick={onNavigate}>Sign Up</Link>
			</Box>
		</Flex>
	)
}
