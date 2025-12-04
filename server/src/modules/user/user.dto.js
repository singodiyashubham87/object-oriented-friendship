// DTO Layer: Data Transfer Object
export const mapUpdateUserDTO = (payload) => ({
  ...(payload.first_name && { firstName: payload.first_name }),
  ...(payload.last_name && { lastName: payload.last_name }),
  ...(payload.avatar && { avatar: payload.avatar }),
  ...(payload.phone && { phone: payload.phone }),
  ...(payload.bio && { bio: payload.bio }),
  ...(payload.skills && { skills: payload.skills }),
  ...(payload.location && { location: payload.location }),
  ...(payload.gender && { gender: payload.gender }),
  ...(payload.age && { age: payload.age }),
});
