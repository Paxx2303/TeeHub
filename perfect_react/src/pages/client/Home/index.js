<<<<<<< HEAD
export { default } from './Home';

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8080/Home', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text(); // API trả về text "Hello World"
        document.getElementById('response').innerText = data; // Hiển thị "Hello World"
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('response').innerText = 'Error: ' + error.message;
    }
}

// Gọi hàm khi trang load
window.onload = fetchData;
=======
export { default } from './Home.jsx';


>>>>>>> origin/tan
