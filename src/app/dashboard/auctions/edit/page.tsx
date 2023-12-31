"use client"
// AuctionEdit.tsx
import React, { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken, GetUser } from '@/app/utils/Auth';

interface Department {
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
  phonenumber: string;
}

function AuctionEdit(props: any) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    department_id: '',
    title: '',
    agent_id: '',
    description: '',
    user_id: '',
  });
  const { auction_id } = props.searchParams;

  useEffect(() => {
    if (auction_id) {
      // Fetch auction details based on auction_id
      const fetchAuctionDetails = async () => {
        Loading.pulse();
        const token = GetToken();
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/${auction_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          const { auction } = data;

          setFormData({
            department_id: auction.department_id,
            title: auction.title,
            agent_id: auction.agent_id,
            description: auction.description,
            user_id: auction.user_id,
          });

          Loading.remove();
        } catch (error) {
          console.error('Error fetching auction details:', error);
        }
      };

      fetchAuctionDetails();
    }
  }, [auction_id]); // Dependency on auction_id to re-fetch data when it changes

  useEffect(() => {
    // Fetch departments from /departments endpoint
    const fetchDepartments = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setDepartments(data.departments);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    // Fetch agents from /users/agents/list endpoint
    const fetchAgents = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setAgents(data);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchDepartments();
    fetchAgents();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = GetToken();
    GetUser().then(async (user) => {
      const formObject = formData;
      formObject.user_id = `${user?.id}`;

      Loading.pulse();
      try {
        // Update auction with the specified data using the PUT method
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/${auction_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formObject),
        });

        if (response.ok) {
          Loading.remove();
          Notify.init({
            width: '300px',
            position: 'left-bottom',
            });
          Notify.success('مزایده با موفقیت ویرایش شد');
        } else {
          console.error('Failed to edit auction:', response.statusText);
        }
      } catch (error) {
        console.error('Error editing auction:', error);
      }
    });
  };

  return (
    <div>
      <h1>ویرایش مزایده</h1>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-3'>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="عنوان مزایده"
            required
          />
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleInputChange}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled>
              انتخاب دپارتمان
            </option>
            {departments.map((department: Department) => (
              <option key={department.id} value={department.id}>
                {department.title}
              </option>
            ))}
          </select>
          <select
            name="agent_id"
            value={formData.agent_id}
            onChange={handleInputChange}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled>
              انتخاب کارشناس
            </option>
            {agents.map((agent: User) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} - {agent.phonenumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={10}
              className="
                                block
                                p-2.5
                                w-full
                                text-sm
                                text-gray-900
                                bg-gray-50
                                rounded-lg
                                border
                                border-gray-300
                                focus:ring-blue-500
                                focus:border-blue-500
                                dark:bg-gray-700
                                dark:border-gray-600
                                dark:placeholder-gray-400
                                dark:text-white
                                dark:focus:ring-blue-500
                                dark:focus:border-blue-500
                                focus:outline-none
                                "
              placeholder="توضیحات مزایده را اینجا وارد کنید..."
            ></textarea>
          </label>
        </div>
        <div>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            type="submit"
          >
            ویرایش مزایده
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuctionEdit;
