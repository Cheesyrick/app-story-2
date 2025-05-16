import AddStoryModel from "../model/add-story-model.js";

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AddStoryModel();
  }

  async handleSubmit(description, photo, lat, lon) {
    try {
      const result = await this.model.submitStory({ 
        description, 
        photo, 
        lat, 
        lon 
      });
      this.view.onSubmitSuccess(result);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

export default AddStoryPresenter;
