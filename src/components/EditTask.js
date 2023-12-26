import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

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

const Content = styled.div`
  padding: 20px 50px;
  background: black;
  border-radius: 10px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const EditButton = styled.button`
  background: linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%, rgba(255, 255, 255, 0.00) 100%);
  background-clip: text;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
  padding: 5px 10px;
`;

const EditTask = ({ taskId, close }) => {
    const queryClient = useQueryClient();
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const selectedTask = tasks.find((task) => task.id === taskId);
        if (selectedTask) {
            setEditedText(selectedTask.text);
        }
    }, [taskId]);

    const handleInputChange = (event) => {
        setEditedText(event.target.value);
    };

    const mutationUpdateText = useMutation(async ({ taskId, newText }) => {
        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = existingTasks.map((task) =>
            task.id === taskId ? { ...task, text: newText } : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
    }, {
        onSuccess: (data) => {
            queryClient.setQueryData('tasks', data);
        },
    });

    const handleSaveClick = () => {
        mutationUpdateText.mutate({ taskId, newText: editedText });
        close();
    };

    return (
        <Backdrop onClick={(event) => { event.stopPropagation(); close(); }}>
            <Content onClick={(event) => event.stopPropagation()}>
                <p style={{ textAlign: 'center' }}>Редактирование задачи</p>
                <input
                    type="text"
                    value={editedText}
                    onChange={handleInputChange}
                    placeholder="Введите новый текст задачи"
                />
                <EditButton onClick={handleSaveClick}>Сохранить изменения</EditButton>
            </Content>
        </Backdrop>
    );
};

export default EditTask;