import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
import SaveTask from "./SaveTask";

const AddTaskContainer = styled.div`
  padding: 20px 50px;
  background: black;
  border-radius: 10px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const AddTaskButton = styled.button`
  font-family: Inter,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  background: var(----linear-gradient, linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%, rgba(255, 255, 255, 0.00) 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border: 0;
  position: absolute;
  margin-left: 1100px;
  margin-top: 175px;
  

  &:hover {
    background-color: #45a049;
  }
`;

export const AddTask = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const addTaskButtonClick = () => {
        setIsModalVisible(true)
    }

    const closeAlert = () => {
        setIsModalVisible(false);
    }

    return (
        <>
            {isModalVisible && <SaveTask close={closeAlert} />}
            <AddTaskContainer>
                <AddTaskButton onClick={addTaskButtonClick}>Добавить задачу</AddTaskButton>
            </AddTaskContainer>
        </>
    );
};