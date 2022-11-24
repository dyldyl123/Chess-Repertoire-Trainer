import TestNotification from "./TestNotification"
import { ReactNode } from "react"
import {
	Box,
	Flex,
	Avatar,
	HStack,
	Link,
	IconButton,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	useColorModeValue,
	Stack,
} from "@chakra-ui/react"
import { useColorMode } from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import { Link as RRDLink } from "react-router-dom"
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md"
const Links = ["Learn"]

const NavLink = ({ children }) => (
	<Link
		as={RRDLink}
		to={`/${children}`}
		px={2}
		py={1}
		rounded={"md"}
		_hover={{
			textDecoration: "none",
			bg: useColorModeValue("gray.200", "gray.700"),
		}}
	>
		{children}
	</Link>
)

export default function TopNav() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { colorMode, toggleColorMode } = useColorMode()

	return (
		<>
			<Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
				<Flex h={16} alignItems={"center"} justifyContent={"center"}>
					<IconButton
						size={"md"}
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						aria-label={"Open Menu"}
						display={{ md: "none" }}
						onClick={isOpen ? onClose : onOpen}
					/>
					<HStack spacing={8} alignItems={"center"}>
						<Box>Chess Repertoire Trainer</Box>
						<HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
							<Link
								as={RRDLink}
								to="/"
								px={2}
								py={1}
								rounded={"md"}
								_hover={{
									textDecoration: "none",
									bg: useColorModeValue("gray.200", "gray.700"),
								}}
							>
								{" "}
								Add Positions
							</Link>
							{Links.map((link) => (
								<NavLink key={link}>{link}</NavLink>
							))}
							<TestNotification />
							<Link onClick={toggleColorMode}>{colorMode === "light" ? <MdDarkMode /> : <MdOutlineLightMode />}</Link>
						</HStack>
					</HStack>
					<Flex alignItems={"center"}></Flex>
				</Flex>

				{isOpen ? (
					<Box pb={4} display={{ md: "none" }}>
						<Stack as={"nav"} spacing={4}>
							{Links.map((link) => (
								<NavLink key={link}>{link}</NavLink>
							))}
						</Stack>
					</Box>
				) : null}
			</Box>
		</>
	)
}
