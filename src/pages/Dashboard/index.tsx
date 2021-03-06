import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      try {
        setFoods(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      const { name, image, description, price } = food;
      let id = 1;
      if (foods.length > 0) {
        const ids = foods.map(item => item.id);
        id = Math.max(...ids) + 1;
      }

      const addFood = {
        image,
        name,
        price,
        description,
        id,
        available: true,
      };
      api.post('/foods', addFood);
      setFoods([...foods, addFood]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // TODO UPDATE A FOOD PLATE ON THE API

    const { id, available } = editingFood;
    const { image, name, price, description } = food;

    const editFood = {
      id,
      available,
      image,
      name,
      price,
      description,
    };
    console.log(editFood);
    api.put(`/foods/${id}`, editFood);
    const updateFoods = foods.map<IFoodPlate>(item => {
      if (item.id === editFood.id) {
        return {
          id: item.id,
          available: item.available,
          description: editFood.description,
          image: editFood.image,
          name: editFood.name,
          price: editFood.price,
        };
      }
      return item;
    });
    setFoods(updateFoods);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    await api.delete(`/foods/${id}`);
    const availableFoods = foods.filter(item => item.id !== id);
    setFoods(availableFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
