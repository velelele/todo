import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background: #0000007d;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SaveButton = styled.button`
  background: linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%, rgba(255, 255, 255, 0.00) 100%);
  background-clip: text;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
  padding: 5px 10px;
`;

const Content = styled.div`
  padding: 20px 50px;
  background: black;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const device = {
    mobileS: `(min-width: ${size.mobileS})`,
    mobileM: `(min-width: ${size.mobileM})`,
    mobileL: `(min-width: ${size.mobileL})`,
    tablet: `(min-width: ${size.tablet})`,
    laptop: `(min-width: ${size.laptop})`,
    laptopL: `(min-width: ${size.laptopL})`,
    desktop: `(min-width: ${size.desktop})`,
    desktopL: `(min-width: ${size.desktop})`
};

const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
}

const SaveTask = (props) => {
    const queryClient = useQueryClient();
    const [taskText, setTaskText] = useState('');

    const contentComponentClickHandle = (event) => {
        event.stopPropagation();
    };

    const handleTaskTextChange = (event) => {
        setTaskText(event.target.value);
    };

    const handleSaveTask = () => {
        const taskTextTrimmed = taskText.trim();
        if (taskTextTrimmed === '') {
            // Не сохраняем пустую задачу
            return;
        }
        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = {
            id: existingTasks.length,
            text: taskTextTrimmed,
            completed: false,
        };
        const updatedTasks = [...existingTasks, newTask];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTaskText('');
        if (props.close) {
            props.close();
        }
        if (queryClient) {
            queryClient.invalidateQueries('tasks');
        }
    };
    return (
        <Backdrop onClick={props.close}>
            <Content onClick={contentComponentClickHandle}>
                <input type="text" value={taskText} onChange={handleTaskTextChange} placeholder="Введите текст задачи" />
                <SaveButton onClick={handleSaveTask}>Добавить задачу</SaveButton>
            </Content>
        </Backdrop>
    )
};

export default SaveTask;