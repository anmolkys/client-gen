document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageDataUrl = event.target.result;

        // Create the image object
        const base64ImageData = imageDataUrl.split(',')[1];
        const image = {
            inlineData: {
                data: base64ImageData,
                mimeType: file.type,
            },
        };
        async function send () {try {
            document.getElementById('output').innerText = "Loading...";
            const response = await fetch('https://letthemcook-production.up.railway.app/imageupload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(image)
            });
            const data = await response.json();
            console.log('Server response:', data);

            // Display the response in a new <h1> element
            document.getElementById('output').innerText = data.output;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    send();
    };
    reader.readAsDataURL(file);



})
