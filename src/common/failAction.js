export default async function failAction(request, h, err) {
  return h.response({ error: err }).code(400);
}
