export default {
	selectedTask: undefined,
	showCompleted: true,
	listState: 'today',

	setListState: (listState) => {
		this.listState = listState;
	},

	setSelectedTask: (task) => {
		this.selectedTask = task;
	},


	toggleShowCompleted: () => {
		this.showCompleted = !this.showCompleted;
	},

	getTodaysTasks: async () => {
		const allTasks = await getAllTasks.run();
		const today = new Date().toISOString().slice(0, 10); // Extract YYYY-MM-DD part
		const todaysTasks = allTasks.filter((task) => task.created_at.startsWith(today));

		const incompleteTasks = todaysTasks.filter(t => t.is_complete === false);

		// Sort the todaysTasks array by the 'created_at' date in descending order
		incompleteTasks.sort((a, b) => b.created_at.localeCompare(a.created_at));
		return incompleteTasks
	},

	getShizheng: () => {
		return "shizhengshizheng"
	},

	getPendingTasks: async () => {
		const allTasks = await getAllTasks.run();
		const pendingTasks = allTasks.filter((task) => !task.is_complete);

		const incompletePendingTasks = pendingTasks.filter(t => t.is_complete === false);

		incompletePendingTasks.sort((a, b) => a.id - b.id);
		return incompletePendingTasks
	},

	getCompletedTasks: async () => {
		const allTasks = await getAllTasks.run();
		const completedTasks = allTasks.filter((task) => task.is_complete);
		completedTasks.sort((a, b) => b.id - a.id);
		return completedTasks
	},

	getOverdueTasks: async () => {
		const allTasks = await getAllTasks.run();
		const today = new Date().toISOString().slice(0, 10); // Extract YYYY-MM-DD part
		const overdueTasks = allTasks.filter((task) => task.deadline > today);

		const incompleteOverdueTasks = overdueTasks.filter(t => t.is_complete === false);

		incompleteOverdueTasks.sort((a, b) => a.id - b.id);
		return incompleteOverdueTasks;
	},

	generateUniqueId: () => {
		const timestamp = Date.now().toString().slice(-5); // Last 5 digits of timestamp
		const randomNum = Math.floor(Math.random() * 10000); // Random number up to 9999
		return parseInt(`${timestamp}${randomNum}`);
	},

	addTask: async () => {
		const randomlyGeneratedId = this.generateUniqueId();
		await createTask.run({
			id: randomlyGeneratedId
		});
		await this.getTodaysTasks();
		await this.getPendingTasks();
		await this.getCompletedTasks();
		await this.getOverdueTasks();

		closeModal(mdl_editTask.name);

		showAlert('Task Created!', 'success');
	},

	updateTask: async () => {
		await updateTask.run();
		await this.getTodaysTasks();
		await this.getPendingTasks();
		await this.getCompletedTasks();
		await this.getOverdueTasks();

		closeModal(mdl_editTask.name);

		showAlert('Task Updated!', 'success');
	},


	// 保留你现有的所有函数和属性...

	// 添加一个使用ky发送请求的新函数
	fetchUserData: async () => {
		try {

			// 发送GET请求到JSONPlaceholder API (一个公开的测试API)
			const response = await ky.default('https://jsonplaceholder.typicode.com/users/1').json();

			return response;
		} catch (error) {
			// 错误处理
			console.error('API请求失败:', error);
			return null;
		}
	},

	// 另一个示例 - 发送POST请求
	createDummyPost: async (title, body) => {
		try {
			const response = await ky.default.post('https://jsonplaceholder.typicode.com/posts', {
				json: {
					title: title || '示例标题',
					body: body || '这是一个示例帖子内容',
					userId: 1
				}
			}).json();

			showAlert(`成功创建帖子，ID: ${response.id}`, 'success');
			return response;
		} catch (error) {
			showAlert(`创建帖子失败: ${error.message}`, 'error');
			console.error('创建帖子失败:', error);
			return null;
		}
	},

	// 这个函数可以作为你的demo展示使用
	runNetworkDemo: async () => {
		// 先获取用户数据
		const userData = await this.fetchUserData();

		if (userData) {
			// 如果获取成功，创建一个带有用户名的帖子
			// await this.createDummyPost(
			// `来自${userData.name}的帖子`, 
			// `这是一个由ID为${userData.id}的用户创建的演示帖子。`
			// );
		}
	}
};

