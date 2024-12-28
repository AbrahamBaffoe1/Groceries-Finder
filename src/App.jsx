import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Select,
  Text,
  Heading,
  List,
  ListItem,
  Container,
  Card,
  CardBody,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa'
import './App.css'

function App() {
  const [selectedStore, setSelectedStore] = useState('target')
  const [shoppingList, setShoppingList] = useState([])
  const [newItem, setNewItem] = useState('')
  const [items, setItems] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    fetchLocations()
  }, [shoppingList, selectedStore])

  const fetchLocations = async () => {
    if (shoppingList.length === 0) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5001/api/search/?q=${shoppingList.join(',')}&store=${selectedStore}`)
      if (!response.ok) throw new Error('Failed to fetch locations')
      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError('Failed to load item locations. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    if (!newItem.trim()) return
    
    setShoppingList([...shoppingList, newItem.trim().toLowerCase()])
    setNewItem('')
    toast({
      title: 'Item added',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleRemoveItem = (index) => {
    const newList = shoppingList.filter((_, i) => i !== index)
    setShoppingList(newList)
  }

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value)
  }

  const handleItemClick = (category, itemName, location) => {
    setSelectedItem({
      category,
      name: itemName,
      location,
      store: selectedStore
    })
    onOpen()
  }

  const handleNavigate = () => {
    if (selectedItem) {
      const query = `${selectedStore} ${selectedItem.location}`
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank')
    }
  }

  const renderLocations = () => {
    if (Object.keys(items).length === 0) {
      return <Text>Add items to your shopping list to see their locations</Text>
    }

    return Object.entries(items).map(([category, categoryItems]) => (
      <Card key={category} my={4} boxShadow="md" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
        <CardBody>
          <Heading size="md" mb={4} color="blue.600">{category.charAt(0).toUpperCase() + category.slice(1)}</Heading>
          <List spacing={3}>
            {Object.entries(categoryItems).map(([itemName, location]) => (
              <ListItem 
                key={`${category}-${itemName}`} 
                p={3} 
                borderRadius="md"
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                onClick={() => handleItemClick(category, itemName, location)}
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FaShoppingCart} color="blue.500" />
                    <Text>{itemName.charAt(0).toUpperCase() + itemName.slice(1)}</Text>
                  </HStack>
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    <HStack spacing={1}>
                      <Icon as={FaMapMarkerAlt} />
                      <Text>{location}</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    ))
  }

  return (
    <Container maxW="container.md" py={8}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Item Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedItem && (
              <VStack align="start" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Item:</Text>
                  <Text>{selectedItem.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Category:</Text>
                  <Text>{selectedItem.category}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Location:</Text>
                  <Text>{selectedItem.location}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Store:</Text>
                  <Text>{selectedItem.store.charAt(0).toUpperCase() + selectedItem.store.slice(1)}</Text>
                </Box>
                <Button 
                  leftIcon={<Icon as={FaMapMarkerAlt} />}
                  colorScheme="blue" 
                  onClick={handleNavigate}
                  width="100%"
                >
                  Navigate to Item
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
        <VStack spacing={8}>
          <Heading>Grocery Store Item Locator</Heading>
          
          <Select value={selectedStore} onChange={handleStoreChange}>
            <option value="target">Target</option>
            <option value="walmart">Walmart</option>
          </Select>

          <HStack width="100%">
            <Input
              placeholder="Add item to shopping list"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <Button colorScheme="blue" onClick={handleAddItem}>Add</Button>
          </HStack>

          {shoppingList.length > 0 && (
            <Card width="100%">
              <CardBody>
                <Heading size="md" mb={4}>Shopping List</Heading>
                <List spacing={3}>
                  {shoppingList.map((item, index) => (
                    <ListItem key={index}>
                      <HStack justify="space-between">
                        <Text>{item}</Text>
                        <Button size="sm" colorScheme="red" onClick={() => handleRemoveItem(index)}>
                          Remove
                        </Button>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          )}

          {error && <Text color="red.500">{error}</Text>}
          
          {loading ? (
            <Text>Loading locations...</Text>
          ) : (
            <Box width="100%">
              {renderLocations()}
            </Box>
          )}
        </VStack>
      </Container>
  )
}

export default App
