import React, { useEffect } from 'react';
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


const DeleteButton = styled.button`
  color: var(----crimson, #DC143C);
  font-family: Inter,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  text-transform: uppercase;
  outline: none; 
  border: 0;
  background: transparent;
  margin: 0 auto;
  display: block;
`;

const EditTask = (props) => {
    const queryClient = useQueryClient();
    const contentComponentClickHandle = (event) => {
        event.stopPropagation();
    };

    // Загружаем текст выбранной задачи в инпут при монтировании компонента
    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.find((task) => task.id === props.taskId);
    }, [props.taskId]);


    const mutationDelete = useMutation(async (taskId) => {
        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = existingTasks.filter((task) => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
    }, {
        onSuccess: (data) => {
            queryClient.setQueryData('tasks', data);
            props.close();
        },
    });

    const handleDeleteClick = () => {
        mutationDelete.mutate(props.taskId);
    };

    return (
        <Backdrop onClick={props.close}>
            <Content onClick={contentComponentClickHandle}>
                <p style={{ textAlign: 'center' }}>Вы уверены что хотите удалить задачу?</p>
                <DeleteButton onClick={() => handleDeleteClick()}>Удалить</DeleteButton>
            </Content>
        </Backdrop>
    );
};

export default EditTask;