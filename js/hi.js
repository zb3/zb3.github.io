(function(){
	//why? I don't really know

	var greetings = ['Hello!', 'Hi!', 'Yo!', 'Ohai!', 'Hey there!', 'Welcome abroad!'];

	document.getElementById('greeting').textContent = greetings[Math.random()*greetings.length|0];
})();